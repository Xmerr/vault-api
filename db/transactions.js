const accountQueries = {};

accountQueries.getByAccount = (userId, accountId, start, end, db) =>
    db.manyOrNone(
        `
            select 
                t.id,
                t.amount,
                t.name,
                t.created_on
            from public.transactions t 
            join public.accounts_to_users atu 
                on atu.account_id = t.account_id 
            where t.account_id = $(accountId)
                and atu.user_id = $(userId)
                and t.created_on between $(start) and $(end)
            order by t.created_on desc;
        `,
        { accountId, end, start, userId }
    );

module.exports = accountQueries;
