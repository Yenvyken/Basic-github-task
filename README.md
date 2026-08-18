# API_Testing_Postman

Validation of API endpoints for a sample application.

## Cypress automation for Odoo 19

This repository includes a Cypress end-to-end test setup for validating an
Odoo 19 web login flow.

### Install dependencies

```bash
npm install
```

### Configure the target Odoo instance

The Cypress configuration defaults to a local Odoo server at
`http://localhost:8069`. Override it and provide credentials with environment
variables:

```bash
export CYPRESS_ODOO_BASE_URL="http://localhost:8069"
export ODOO_DB="your_odoo_database"
export ODOO_USERNAME="admin"
export ODOO_PASSWORD="admin"
```

`ODOO_DB` is optional when the Odoo instance already selects a database.

### Run tests

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
login reaches the `/web` application.
