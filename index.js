require('dotenv').config();
const port = process.env.PORT;
const Koa = require('koa');
const cors = require('koa2-cors');
const parser = require('koa-bodyparser');
const session = require('koa-session');
const { koaSwagger } = require('koa2-swagger-ui');
const attachDb = require('./middleware/attachDb');
const auth = require('./middleware/auth');
const error = require('./middleware/error');
const routes = require('./routes');

const app = new Koa();
require('koa-validate')(app);

app.keys = [process.env.SECRET];

app.use(
    cors({
        allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        credentials: true,
    })
)
    .use(parser({ enableTypes: ['json'] }))
    .use(session(app))
    .use(
        koaSwagger({
            routePrefix: '/swagger', // Where to find the docs
            swaggerOptions: {
                url: 'http://api.bank.io/swag', // Where to pull the doc config from - should be moved to the .env file
            },
        })
    )
    .use(error)
    .use(attachDb)
    .use(auth);

routes(app).listen(port);

console.log(`app listening on port: ${port}`);
