create extension if not exists "uuid-ossp";

create schema if not exists accounts;

create table if not exists accounts.users (
    id uuid primary key not null default uuid_generate_v4(),
    username varchar not null,
    password varchar not null,
    first_name varchar not null,
    last_name varchar not null,
    email varchar,
    phone varchar
);
