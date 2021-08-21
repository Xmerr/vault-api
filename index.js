require('dotenv').config();
const port = process.env.PORT;
const Koa = require('koa');
const cors = require('koa2-cors');
const parser = require('koa-bodyparser');
const session = require('koa-session');
const { koaSwagger } = require('koa2-swagger-ui');
const auth = require('./middleware/auth');
const error = require('./middleware/error');

const app = new Koa();
require('koa-validate')(app);

app.keys = [process.env.SECRET];

const account = require('./routes/account');
const { router, config } = require('./routes/swag');

app.use(
    cors({
        allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        credentials: true,
    })
)
    .use(parser({ enableTypes: ['json'] }))
    .use(session(app))
    .use(koaSwagger(config))
    .use(error)
    .use(auth)
    .use(account.routes())
    .use(router.routes())
    .listen(port);

console.log(`app listening on port: ${port}`);
