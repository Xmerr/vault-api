const pgp = require('pg-promise');
const pgpOptions = {
    receive(data) {
        const tmp = data[0];
        for (const prop in tmp) {
            const camel = pgp.utils.camelize(prop);
            if (!(camel in tmp)) {
                for (let i = 0; i < data.length; i++) {
                    const d = data[i];
                    d[camel] = d[prop];
                    delete d[prop];
                }
            }
        }
    },
};
const db = pgp(pgpOptions)(process.env.PG_STRING);
const users = require('../db/users');

module.exports = async (ctx, next) => {
    ctx.state.db = db;

    if (ctx.session.userId) {
        const login = await users.getById(ctx.session.userId, db);
        if (!login) {
            ctx.session = null;
        }

        // eslint-disable-next-line no-unused-vars
        const { password, ...user } = login;
        ctx.state.user = user;
    }

    await next();
};
