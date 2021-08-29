const Router = require('koa-router');
const accountTypes = require('../db/accountTypes');

const router = new Router({
    prefix: '/account-types',
});

/**
 * @swagger
 * /account-types:
 *      get:
 *          tags: [Account-Types]
 *          summary: Returns a list of account types
 *          description: Returns the full list of acount types available to the public
 *          responses:
 *              201:
 *                  description: Account Successfully Created
 */
router.get('/', async ctx => {
    const { db } = ctx.state;

    const accountList = await accountTypes.getAllPublic(db).catch(e => {
        ctx.throw(500, e);
    });

    ctx.status = 200;
    ctx.body = accountList;
});

module.exports = router;
