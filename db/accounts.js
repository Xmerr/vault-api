const accountQueries = {};

accountQueries.create = (accountObject, db) =>
    db.oneOrNone(
        `
            with ac as (
                insert into public.accounts (
                    account_type
                ) values (
                    $(accountType)
                )
                returning id
            ), atu as (
                insert into public.accounts_to_users (nickname, user_id, account_id)
                select $(nickname), $(userId), ac.id
                from ac
            )
            insert into public.transactions (account_id, amount, name, details)
            select 
                ac.id,
                $(value),
                'Initial Deposit',
                'Account created'
            from ac;
        `,
        accountObject
    );

accountQueries.getAccountSummaries = (userId, db) =>
    db.manyOrNone(
        `
            select
                atu.account_id id,
                atu.nickname,
                at2.name type_name,
                at2.color,
                sum(t.amount)::integer as current,
                sum(t.amount)::integer as available,
                at2.interest_rate::float,
                at2.investment,
                0 as ytd_interest
            from public.transactions t 
            join public.accounts_to_users atu 
                on atu.account_id = t.account_id 
            join public.accounts a
                on atu.account_id = a.id
            join public.account_types at2
                on at2.id = a.account_type
            where atu.user_id = $(userId)
            group by
                at2.color,
                at2.interest_rate,
                at2.investment,
                at2.name,
                atu.account_id,
                atu.nickname;
        `,
        { userId }
    );

module.exports = accountQueries;
