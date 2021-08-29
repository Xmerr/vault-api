create extension if not exists "uuid-ossp";

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
  "username" varchar NOT NULL,
  "password" varchar NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar,
  "phone" varchar,
  "created_on" timestamptz  NOT NULL DEFAULT (now())
);

CREATE TABLE "accounts" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
  "name" varchar NOT NULL,
  "account_type" uuid NOT NULL,
  "opened_on" timestamptz  NOT NULL DEFAULT (now())
);

CREATE TABLE "accounts_to_users" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
  "user_id" uuid NOT NULL,
  "account_id" uuid NOT NULL
);

CREATE TABLE "account_types" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
  "name" varchar NOT NULL,
  "investment" boolean NOT NULL DEFAULT false,
  "interest_rate" numeric(7, 4) NOT NULL DEFAULT 0
);

CREATE TABLE "transactions" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
  "account_id" uuid NOT NULL,
  "amount" integer NOT NULL,
  "name" varchar NOT NULL,
  "details" varchar NOT NULL,
  "created_on" timestamptz  NOT NULL DEFAULT (now())
);

ALTER TABLE "accounts_to_users" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "accounts_to_users" ADD FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");

ALTER TABLE "accounts" ADD FOREIGN KEY ("account_type") REFERENCES "account_types" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");

