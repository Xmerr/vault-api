const userQueries = {};

userQueries.getById = (id, db) =>
    db.oneOrNone(
        `
            select *
            from public.users u
            where id = $(id)
        `,
        { id }
    );

userQueries.getByUsername = (username, db) =>
    db.oneOrNone(
        `
            select *
            from public.users u
            where username ilike $(username)
        `,
        { username }
    );

userQueries.create = (userObject, db) =>
    db.oneOrNone(
        `
            insert into public.users (
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

module.exports = userQueries;
