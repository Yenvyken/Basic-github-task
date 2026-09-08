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

## RetailRise registration flow

The registration flow spec is located at
`cypress/e2e/retailrise_registration.cy.js`. It opens the RetailRise login page,
clicks **Create an account**, fills the registration form with generated test
data, and submits it.

To customize the flow locally, copy `cypress.env.example.json` to
`cypress.env.json` and edit these values:

```json
{
  "RETAILRISE_LOGIN_URL": "https://retailrise.africa/get-started?mode=login",
  "REGISTRATION_FULL_NAME": "RetailRise Test User",
  "REGISTRATION_BUSINESS_NAME": "RetailRise Test Business",
  "REGISTRATION_EMAIL": "retailrise.test@example.com",
  "REGISTRATION_PHONE": "08012345678",
  "REGISTRATION_PASSWORD": "RetailRiseTest123!"
}
```

Run only the registration spec:

```bash
npm run cy:run -- --spec cypress/e2e/retailrise_registration.cy.js
```
