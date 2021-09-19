const Router = require('koa-router');
const yup = require('yup');
const validator = require('../middleware/validator');
const userRequired = require('../middleware/userRequired');
const accountsDb = require('../db/accounts');
const transactionsDb = require('../db/transactions');

const router = new Router({
    prefix: '/accounts',
});

/**
 * @swagger
 * /accounts/create:
 *      post:
 *          tags: [Account]
 *          summary: Creates a new account for the logged in user
 *          description: Accepts the a name for the account and an account type to create
 *          requestBody:
 *              description: Account Details
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                            - nickname
 *                            - type
 *                            - value
 *                          properties:
 *                              nickname:
 *                                  type: string
 *                                  description: Account Name
 *                                  example: Checking
 *                              type:
 *                                  type: string
 *                                  description: uuid of the account type - this can be located by using [GET /account-types]
 *                                  example: 71b65b6f-37bc-483f-88c3-8e820a6e88d8
 *                              value:
 *                                  type: number
 *                                  description: Initial value for the new account(without decimal points)
 *                                  example: 500
 *          responses:
 *              201:
 *                  description: Account Successfully Created
 */
router.post(
    '/create',
    userRequired,
    validator({
        body: yup.object().shape({
            nickname: yup.string().required(),
            type: yup.string().uuid().required(),
            value: yup.number().required(),
        }),
    }),
    async ctx => {
        const {
            body: { nickname, type, value },
            user: { id: userId },
            db,
        } = ctx.state;

        await accountsDb.create({ accountType: type, nickname, userId, value }, db).catch(e => {
            ctx.throw(500, e);
        });

        ctx.status = 201;
    }
);

/**
 * @swagger
 * /accounts:
 *      get:
 *          tags: [Account]
 *          summary: Get user accounts
 *          description: Gets a summary of all the accounts associated with this user
 *          responses:
 *              200:
 *                  description: Success
 */
router.get('/', userRequired, async ctx => {
    const {
        user: { id: userId },
        db,
    } = ctx.state;

    const accountList = await accountsDb.getAccountSummaries(userId, db).catch(e => {
        ctx.throw(500, e);
    });

    ctx.status = 200;
    ctx.body = accountList;
});

/**
 * @swagger
 * /accounts/{id}:
 *      get:
 *          tags: [Account]
 *          summary: Get account details
 *          description: Gets details for the passed in account. Will only work if the user has access to the specified account
 *          parameters:
 *              - name: id
 *                in: path
 *                description: ID of the account
 *                required: true
 *                type: uuid
 *          responses:
 *              200:
 *                  description: Success
 *              404:
 *                  description: Unable to find the account
 */
router.get('/:id', userRequired, async ctx => {
    const {
        user: { id: userId },
        db,
    } = ctx.state;
    const { id } = ctx.params;
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startDate = new Date(today.getFullYear(), 0, 1);

    const [account, transactions] = await Promise.all([
        accountsDb.getAccountDetails(userId, id, db),
        transactionsDb.getByAccount(userId, id, startDate, endDate, db),
    ]).catch(e => {
        ctx.throw(500, e);
    });

    if (!account) {
        ctx.throw(404, 'Unable to find account');
    }

    ctx.status = 200;
    ctx.body = {
        account,
        transactions,
    };
});

/**
 * @swagger
 * /accounts/setNickname/{id}:
 *      put:
 *          tags: [Account]
 *          summary: Changes the nickname for the specified account
 *          description: Requires the account id and nickname to set. The user must have access to the account
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                            - nickname
 *                          properties:
 *                              nickname:
 *                                  type: string
 *                                  description: New name for the account
 *                                  example: Checking
 *          parameters:
 *              - name: id
 *                in: path
 *                description: ID of the account
 *                required: true
 *                type: uuid
 *          responses:
 *              200:
 *                  description: Nickname successfully changed
 *              404:
 *                  description: Account not found
 *              409:
 *                  description: Account name was not unique for this user
 */
router.put(
    '/setNickname/:id',
    userRequired,
    validator({
        body: yup.object().shape({
            nickname: yup.string().required(),
        }),
    }),
    async ctx => {
        const {
            body: { nickname },
            user: { id: userId },
            db,
        } = ctx.state;
        const { id } = ctx.params;

        const account = await accountsDb.getAccountDetails(userId, id, db);

        if (!account) {
            ctx.throw(404, 'Unable to find account');
        }

        await accountsDb.setNickname(userId, id, nickname, db).catch(e => {
            ctx.throw(409, 'Account names must be unique');
        });

        ctx.status = 200;
    }
);

module.exports = router;
