const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_ODOO_BASE_URL || 'http://localhost:8069',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 10000,
    screenshotOnRunFailure: true,
    video: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    env: {
      ODOO_DB: process.env.ODOO_DB || '',
      ODOO_USERNAME: process.env.ODOO_USERNAME || '',
      ODOO_PASSWORD: process.env.ODOO_PASSWORD || '',
    },
  },
});
