create or replace function generate_account_number() 
    returns int as
$$
declare 
  low int := 1011111111;
  high int := 1959999999;
  num varchar;
  cnt int := 0;
begin
	loop
		num := (floor(random()* (high-low + 1) + low))::varchar;
	
		select count(*)
		into cnt
		from public.accounts
		where account_number = num;
	
		if cnt = 0 then
			exit;
		end if;
	end loop;

	return num;
end;
$$ language 'plpgsql' strict;

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
  account_number varchar not null unique default (generate_account_number())
  account_type uuid not null,
  opened_on timestamptz not null default (now())
);

create table accounts_to_users (
  id uuid primary key not null default (uuid_generate_v4()),
  nickname varchar not null,
  user_id uuid not null,
  account_id uuid not null,
  unique (nickname, user_id)
);

create table account_types (
  id uuid primary key not null default (uuid_generate_v4()),
  name varchar not null,
  investment boolean not null default false,
  interest_rate numeric(7, 4) not null default 0,
  color varchar not null
);

create table transactions (
  id uuid primary key not null default (uuid_generate_v4()),
  account_id uuid not null,
  amount integer not null,
  name varchar not null,
  created_on timestamptz  not null default (now())
);

alter table accounts_to_users add foreign key (user_id) references users (id) on delete cascade;
alter table accounts_to_users add foreign key (account_id) references accounts (id) on delete cascade;
alter table accounts add foreign key (account_type) references account_types (id) on delete cascade;
alter table transactions add foreign key (account_id) references accounts (id) on delete cascade;

