module.exports = data => async (ctx, next) => {
    const { body } = data;

    let isValid = true;

    if (body) {
        const validBody = await body.isValid(ctx.request.body);

        if (validBody) {
            ctx.state.body = await body.cast(ctx.request.body);
        }

        isValid &= validBody;
    }

    if (isValid) {
        await next();
    } else {
        ctx.throw(406, 'Invalid Request');
    }
};
