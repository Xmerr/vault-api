require('dotenv').config();
const port = process.env.PORT;
const Koa = require('koa');
const parser = require('koa-bodyparser');
const cors = require('koa2-cors');
const { koaSwagger } = require('koa2-swagger-ui')

const app = new Koa();

const account = require('./routes/account');
const { router, config } = require('./routes/swag');

app
    .use(cors({ allowMethods: [ 'GET', 'PUT', 'POST', 'DELETE' ] }))
    .use(parser({ enableTypes: [ 'json' ]}))
    .use(koaSwagger(config))
    .use(account.routes())
    .use(router.routes())
    .use(async ctx => {
        ctx.status = 404;
        ctx.body = 'Not Found';
    });

app.listen(port);
console.log(`app listening on port: ${port}`);