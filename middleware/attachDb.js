const pgp = require('pg-promise');

const pgpOptions = {
    receive(records) {
        // camelCase column names
        const firstRecord = records[0];
        for (const prop in firstRecord) {
            const camelVariant = pgp.utils.camelize(prop);

            if (!(camelVariant in firstRecord)) {
                records.forEach(record => {
                    const { [prop]: data } = record;
                    delete record[prop];
                    record[camelVariant] = data;
                });
            }
        }
    },
};

const db = pgp(pgpOptions)(process.env.PG_STRING);

module.exports = async (ctx, next) => {
    ctx.state.db = db;
    await next();
};
