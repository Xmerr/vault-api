# The Vault (API)

The following repos are required for this project to work in it's entirety:

-   [The Vault (UI)](https://github.com/Xmerr/vault-ui) - The UI element for this project

---

## Environment

This project requires a `.env` file with the following properties:

```
PORT=<port number to run on>
SECRET=<random string>
SALT_ROUNDS=<random number (if you don't use 8 the seed data will not work)>
PG_STRING=<Connection string to postgres database>
```

---

## Database

This project was built using `PostgresSQL`. Instructions on how to set up your database as well as a ERD can be found in the `/db/_init` folder.

---

## Swagger

This project uses swagger for testing endpoints. To view the swagger you can visit `localhost:<port number>/swagger` in any web browser.
