const path = require('path');
const Router = require('koa-router');
const swaggerJsdoc = require('swagger-jsdoc');

const router = new Router({ prefix: '/swag' });
const routeFiles = require('../helpers/routeFiles');

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
        apis: routeFiles.reduce((apis, name) => {
            if (name !== 'swag.js') {
                apis.push(path.resolve(__dirname, name));
            }

            return apis;
        }, []),
    };

    const openapiSpecification = swaggerJsdoc(options);
    ctx.body = openapiSpecification;
});

module.exports = router;
