const accountTypeQueries = {};

accountTypeQueries.getAllPublic = db =>
    db.many(
        `
            select *
            from public.account_types;
        `
    );

module.exports = accountTypeQueries;
