create extension if not exists "uuid-ossp";

create table users (
  id uuid primary key not null default (uuid_generate_v4()),
  username varchar not null,
  password varchar not null,
  first_name varchar not null,
  last_name varchar not null,
  email varchar,
  phone varchar,
  created_on timestamptz  not null default (now())
);

create table accounts (
  id uuid primary key not null default (uuid_generate_v4()),
  account_type uuid not null,
  opened_on timestamptz not null default (now())
);

create table accounts_to_users (
  id uuid primary key not null default (uuid_generate_v4()),
  nickname varchar not null,
  user_id uuid not null,
  account_id uuid not null
);

create table account_types (
  id uuid primary key not null default (uuid_generate_v4()),
  name varchar not null,
  investment boolean not null default false,
  interest_rate numeric(7, 4) not null default 0
);

create table transactions (
  id uuid primary key not null default (uuid_generate_v4()),
  account_id uuid not null,
  amount integer not null,
  name varchar not null,
  details varchar not null,
  created_on timestamptz  not null default (now())
);

alter table accounts_to_users add foreign key (user_id) references users (id) on delete cascade;
alter table accounts_to_users add foreign key (account_id) references accounts (id) on delete cascade;
alter table accounts add foreign key (account_type) references account_types (id) on delete cascade;
alter table transactions add foreign key (account_id) references accounts (id) on delete cascade;

