const pgp = require('pg-promise')();
const db = pgp(process.env.PG_STRING);
const users = require('../db/users');

module.exports = async (ctx, next) => {
    ctx.state.db = db;

    if (ctx.session.userId) {
        // eslint-disable-next-line no-unused-vars
        const { password, ...user } = await users.getById(ctx.session.userId, db);
        ctx.state.user = user;
    }

    await next();
};
