const port = 28891;
const Koa = require('koa');
const parser = require('koa-bodyparser');
const { koaSwagger } = require('koa2-swagger-ui')

const app = new Koa();

const accounts = require('./routes/accounts');
const { router, config } = require('./routes/swag');

app
    .use(parser({ enableTypes: [ 'json' ]}))
    .use(koaSwagger(config))
    .use(accounts.routes())
    .use(router.routes())
    .use(async ctx => {
        ctx.status = 404;
        ctx.body = 'Not Found';
    });

app.listen(port);
console.log(`app listening on port: ${port}`);