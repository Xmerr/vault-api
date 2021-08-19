const Router = require('koa-router');

const router = new Router({
    prefix: '/account'
});

/**
 * @swagger
 * /pet:
 *      post:
 *          tags: [Accounts]
 *          summary: Temp
 *          description: Temp2
 *          requestBody:
 *              description: Pet to be added
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/Pet'
 *          responses:
 *              201:
 *                  description: Successfully Added Pet
 */
router.post('/login', async ctx => {
    const { username } = ctx.request.body;
    ctx.staus = 200;
    ctx.body = {
        username,
        token: '123'
    };
});

module.exports = router;