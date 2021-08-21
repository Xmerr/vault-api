const Router = require('koa-router');
const bcrypt = require('bcrypt');
const yup = require('yup');
const validator = require('../middleware/validator');
const userRequired = require('../middleware/userRequired');
const users = require('../db/users');

const router = new Router({
    prefix: '/account',
});

const createUser = async (params, db) => {
    const usernameTaken = await users.getByUsername(params.username, db);

    if (usernameTaken) {
        throw 409;
    }

    const user = await users.create(params, db);
    return user;
};

/**
 * @swagger
 * /account/create:
 *      post:
 *          tags: [Account]
 *          summary: Logs the user into the site
 *          description: Accepts username and password, compares that to the database, then sets a cookie to store userid for future requests
 *          requestBody:
 *              description: Credentials
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                            - username
 *                            - password
 *                            - firstName
 *                            - lastName
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: Login name
 *                                  example: Guest
 *                              password:
 *                                  type: string
 *                                  description: Password for that login
 *                                  example: guest
 *                              firstName:
 *                                  type: string
 *                                  description: First name of this user
 *                                  example: Foo
 *                              lastName:
 *                                  type: string
 *                                  description: Sir name of this user
 *                                  example: Bar
 *                              phone:
 *                                  type: string
 *                                  description: Phone number for this user
 *                                  example: 555-555-5555
 *                              email:
 *                                  type: string
 *                                  description: Email for this user
 *                                  example: test@test.com
 *          responses:
 *              201:
 *                  description: Account Successfully Created
 */
router.post(
    '/create',
    validator({
        body: yup.object().shape({
            email: yup.string().email(),
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            password: yup.string().required(),
            phone: yup.string(),
            username: yup.string().required(),
        }),
    }),
    async ctx => {
        const {
            body: { password },
            db,
        } = ctx.state;
        const pw = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

        const user = await createUser(
            {
                ...ctx.state.body,
                password: pw,
            },
            db
        ).catch(e => {
            switch (e) {
                case 409:
                    ctx.throw(409, 'Username Already Taken');
                    return;
                default:
                    ctx.throw(500, e);
            }
        });

        ctx.session.userId = user.id;
        ctx.status = 201;
    }
);

/**
 * @swagger
 * /account/login:
 *      post:
 *          tags: [Account]
 *          summary: Logs the user into the site
 *          description: Accepts username and password, compares that to the database, then sets a cookie to store userid for future requests
 *          requestBody:
 *              description: Credentials
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                            - username
 *                            - password
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: Login name
 *                                  example: Guest
 *                              password:
 *                                  type: string
 *                                  description: Password for that login
 *                                  example: guest
 *          responses:
 *              202:
 *                  description: Successfully Logged In
 *              403:
 *                  description: Invalid Username/Password combo
 */
router.post(
    '/login',

    validator({
        body: yup.object().shape({
            password: yup.string().required(),
            username: yup.string().required(),
        }),
    }),
    async ctx => {
        const {
            body: { password, username },
            db,
        } = ctx.state;

        const badMatch = () => ctx.throw(403, 'Invalid Username or Password');

        const user = await users.getByUsername(username, db);
        if (!user) {
            return badMatch();
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return badMatch();
        }

        ctx.status = 202;
        ctx.session.userId = user.id;
    }
);

/**
 * @swagger
 * /account:
 *      get:
 *          tags: [Account]
 *          summary: Returns user info
 *          description: Returns the user object if the user is logged in
 *          responses:
 *              200:
 *                  description: Session checked
 */
router.get('/', async ctx => {
    ctx.body = ctx.state.user;
});

/**
 * @swagger
 * /account/logout:
 *      delete:
 *          tags: [Account]
 *          summary: Clears the session for this user
 *          description: If the user is logged in this route should log them out
 *          responses:
 *              202:
 *                  description: Session cleared
 */
router.delete('/logout', userRequired, async ctx => {
    ctx.status = 202;
    ctx.session = null;
});

module.exports = router;
