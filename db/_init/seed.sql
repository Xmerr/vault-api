insert into users (username, password, first_name, last_name, email, phone)
values ('Xmer', '$2b$08$GAZDsOP6TJWe/1eAakVmbOAnicrm0/LIHntwsxbtGDMHA1b29DUiO', 'Wiley', 'Hilton', 'test@test.com', '555-555-5555');

insert into account_types (name, investment, interest_rate, color)
values
('Checking', false, 0.25, '#6f629a'),
('Savings', false, 2, '#09254e'),
('Money Market', false, 1, '#30db6f');

with acs as (
	insert into public.accounts (account_type)
	values
		((select id from public.account_types where name = 'Checking')),
		((select id from public.account_types where name = 'Savings'))
	returning *
)
insert into public.accounts_to_users (nickname, user_id, account_id)
select
	at2.name,
	(select id from public.users where username = 'Xmer'),
	acs.id
from acs
join public.account_types at2
	on acs.account_type = at2.id;

insert into public.transactions (account_id, amount, name)
values
	((select account_id from public.accounts_to_users where nickname = 'Checking'), 10000, 'Direct Deposit'),
	((select account_id from public.accounts_to_users where nickname = 'Checking'), -100, 'Waterdeep Wazoo Subscription'),
	((select account_id from public.accounts_to_users where nickname = 'Checking'), -425, 'The Yawning Portal'),
	((select account_id from public.accounts_to_users where nickname = 'Checking'), 1000, 'Deposit'),
	((select account_id from public.accounts_to_users where nickname = 'Checking'), -1000, 'Transfer To Savings'),
	((select account_id from public.accounts_to_users where nickname = 'Checking'), -5000, 'Zhentarim Payment'),
	((select account_id from public.accounts_to_users where nickname = 'Savings'), 1000, 'Transfer From Checking');

