const accountQueries = {};

accountQueries.create = (accountObject, db) =>
    db.oneOrNone(
        `
            with ac as (
                insert into public.accounts (
                    name,
                    account_type
                ) values (
                    $(name),
                    $(accountType)
                )
                returning id
            )
            insert into public.accounts_to_users (user_id, account_id)
            select $(userId), ac.id
            from ac;
        `,
        accountObject
    );

accountQueries.getAccountSummaries = (userId, db) =>
    db.manyOrNone(
        `
            select
                atu.account_id,
                atu.nickname,
                sum(t.amount) as current
            from public.transactions t 
            join public.accounts_to_users atu 
                on atu.account_id = t.account_id 
            where atu.user_id = $(userId)
            group by atu.account_id, atu.nickname
        `,
        { userId }
    );

module.exports = accountQueries;
