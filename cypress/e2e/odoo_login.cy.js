describe('Odoo 19 login', () => {
  const database = Cypress.env('ODOO_DB');
  const username = Cypress.env('ODOO_USERNAME');
  const password = Cypress.env('ODOO_PASSWORD');

  const visitLoginPage = () => {
    cy.visit('/web/login', database ? { qs: { db: database } } : undefined);
  };

  it('loads the Odoo login page', () => {
    visitLoginPage();

    cy.get('input[name="login"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('form').within(() => {
      cy.get('button[type="submit"], input[type="submit"]').should('be.visible');
    });
  });

  it('logs in with configured Odoo credentials', function () {
    if (!username || !password) {
      this.skip();
    }

    cy.loginToOdoo({ database, username, password });

    cy.location('pathname', { timeout: 30000 }).should((pathname) => {
      expect(pathname).to.not.equal('/web/login');
      expect(pathname).to.match(/^\/web(\/.*)?$/);
    });

    cy.get('body').should('not.contain', 'Wrong login/password');
  });
});
