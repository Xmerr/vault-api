module.exports = async (ctx, next) => {
    const user = ctx.state.user;

    if (user && user.id) {
        await next();
        return;
    }

    ctx.throw(403, 'You must be logged in to use this feature');
};
