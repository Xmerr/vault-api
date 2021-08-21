const queries = {};

queries.getById = (id, db) =>
    db.oneOrNone(
        `
            select *
            from accounts.users u
            where id = $(id)
        `,
        { id }
    );

queries.getByUsername = (username, db) =>
    db.oneOrNone(
        `
            select *
            from accounts.users u
            where username ilike $(username)
        `,
        { username }
    );

queries.create = (userObject, db) =>
    db.oneOrNone(
        `
            insert into accounts.users (
                username,
                password,
                first_name,
                last_name,
                email,
                phone
            ) values (
                $(username),
                $(password),
                $(firstName),
                $(lastName),
                $(email),
                $(phone)
            )
            returning *;
        `,
        userObject
    );

module.exports = queries;
