const users = require('../db/users');

module.exports = async (ctx, next) => {
    const { db } = ctx.state;

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
