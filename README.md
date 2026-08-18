# API_Testing_Postman

Validation of API endpoints for a sample application.

## Cypress automation for Odoo 19

This repository includes a Cypress end-to-end test setup for validating an
Odoo 19 web login flow.

### Install dependencies

```bash
npm install
```

### Run a local Odoo 19 instance (Docker Compose)

A `docker-compose.yml` is included to spin up Odoo 19 and PostgreSQL locally:

```bash
docker compose up -d
```

The Odoo web server is published on `http://localhost:8069`. On first boot you
must create/initialize a database (named `odoo` below) and set the admin
password:

```bash
docker compose exec -T odoo odoo -d odoo -i base --stop-after-init \
  --db_host=127.0.0.1 --db_port=5432 --db_user=odoo --db_password=odoo
```

> Cloud Agent users do not need to run any of this manually. The committed
> `.cursor/environment.json` starts Docker, brings up Odoo + Postgres,
> initializes the database, and writes a local `cypress.env.json` automatically,
> so `npm run cy:run` works out of the box.

### Configure the target Odoo instance

The Cypress configuration defaults to a local Odoo server at
`http://localhost:8069`. Override it with either `CYPRESS_ODOO_BASE_URL` or the
standard Cypress `CYPRESS_BASE_URL` environment variable, then provide Odoo
credentials:

```bash
export CYPRESS_ODOO_BASE_URL="http://localhost:8069"
export ODOO_DB="your_odoo_database"
export ODOO_USERNAME="admin"
export ODOO_PASSWORD="admin"
```

`ODOO_DB` is optional when the Odoo instance already selects a database.

You can also copy `cypress.env.example.json` to `cypress.env.json` and edit the
values locally. `cypress.env.json` is gitignored so real credentials are not
committed.

### Run tests

Verify the Cypress binary:

```bash
npm run cy:verify
```

Run Cypress headlessly:

```bash
npm run cy:run
```

Open the Cypress test runner:

```bash
npm run cy:open
```

The initial spec is located at `cypress/e2e/odoo_login.cy.js`. It verifies that
the Odoo login page loads and, when credentials are configured, validates that
login reaches the Odoo web client (`/web` or `/odoo`, depending on the Odoo 19
routing configuration).
