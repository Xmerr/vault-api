const path = require('path');
const Router = require('koa-router');
const swaggerJsdoc = require('swagger-jsdoc');

const router = new Router({ prefix: '/swag' });

const config = {
    routePrefix: '/swagger', // Where to find the docs
    swaggerOptions: {
        url: 'http://api.bank.io/swag', // Where to pull the doc config from - could be stored in the config yamls
    },
};

router.get('/', async ctx => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Swagger + JSDoc Test',
                version: '0.0.1',
            },
            tags: [],
        },
        apis: [path.resolve(__dirname, '*.js')],
    };

    const openapiSpecification = swaggerJsdoc(options);
    ctx.body = openapiSpecification;
});

module.exports = {
    router,
    config,
};
