# Diagram

![Entity Relationship Diagram](./images/ERD.png 'Entity Relationship Diagram')

Make sure you run both `createDb.sql` and `seed.sql`, in that order, before attempting to run. These scripts can both be found in the `db/_init` folder. The default login is:

> username: Guest

> password: guest

---

### Database Diagram was made using [dbdiagram.io](https://dbdiagram.io/)

The diagram can be recreated by using the following code in their editor:

```
Table "users" {
  "id" uuid [pk, not null, default: `uuid_generate_v4()`]
  "username" varchar [not null]
  "password" varchar [not null]
  "first_name" varchar [not null]
  "last_name" varchar [not null]
  "email" varchar
  "phone" varchar
  "created_on" timestamp [not null, default: `now()`]
}

Table "accounts" {
  "id" uuid [pk, not null, default: `uuid_generate_v4()`]
  "account_type" uuid [not null]
  "opened_on" timestamp [not null, default: `now()`]
}

Table "accounts_to_users" {
  "id" uuid [pk, not null, default: `uuid_generate_v4()`]
  "nickname" varchar [not null]
  "user_id" uuid [not null]
  "account_id" uuid [not null]
}

Table "account_types" {
  "id" uuid [pk, not null, default: `uuid_generate_v4()`]
  "name" varchar [not null]
  "investment" boolean [not null, default: false]
  "interest_rate" "numeric(7, 4)" [not null, default: 0]
}

Table "transactions" {
  "id" uuid [pk, not null, default: `uuid_generate_v4()`]
  "account_id" uuid [not null]
  "amount" integer [not null]
  "name" varchar [not null]
  "details" varchar [not null]
  "created_on" timestamp [not null, default: `now()`]
}

Ref:"users"."id" < "accounts_to_users"."user_id" [delete: cascade]

Ref:"accounts"."id" < "accounts_to_users"."account_id" [delete: cascade]

Ref:"account_types"."id" < "accounts"."account_type" [delete: cascade]

Ref:"accounts"."id" < "transactions"."account_id" [delete: cascade]
```
