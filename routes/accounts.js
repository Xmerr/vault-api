const Router = require('koa-router');

const router = new Router({
    prefix: '/accounts'
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
router.get('/', async ctx => {
    ctx.body = 'gotem';
});

module.exports = router;