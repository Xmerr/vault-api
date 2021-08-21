module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        ctx.status = e.status || e.statusCode || 500;
        ctx.body = e.message;
    }
};
