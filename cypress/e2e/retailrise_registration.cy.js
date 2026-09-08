const visibleText = (element) =>
  [element.innerText, element.value, element.getAttribute('aria-label')]
    .filter(Boolean)
    .join(' ')
    .trim();

const clickVisibleByText = (selector, labelPattern) => {
  cy.get(selector)
    .filter(':visible')
    .then(($elements) => {
      const match = [...$elements].find((element) =>
        labelPattern.test(visibleText(element)),
      );

      expect(match, `visible ${selector} matching ${labelPattern}`).to.exist;
      cy.wrap(match).click();
    });
};

const firstVisibleSelector = ($body, selectors) =>
  selectors.find((selector) => $body.find(selector).filter(':visible').length);

const fillRequiredField = (selectors, value, fieldName, options = {}) => {
  cy.get(selectors.join(', '), { timeout: 10000 })
    .filter(':visible')
    .first()
    .should('be.enabled')
    .clear()
    .type(value, { log: options.log !== false });

  cy.log(`Filled ${fieldName}`);
};

const fillOptionalField = (selectors, value, fieldName, options = {}) => {
  cy.get('body').then(($body) => {
    const selector = firstVisibleSelector($body, selectors);

    if (!selector) {
      cy.log(`Skipped ${fieldName}; no matching field found`);
      return;
    }

    cy.get(selector)
      .filter(':visible')
      .first()
      .should('be.enabled')
      .clear()
      .type(value, { log: options.log !== false });

    cy.log(`Filled ${fieldName}`);
  });
};

const checkOptionalBox = (selectors, fieldName) => {
  cy.get('body').then(($body) => {
    const selector = firstVisibleSelector($body, selectors);

    if (!selector) {
      cy.log(`Skipped ${fieldName}; no matching checkbox found`);
      return;
    }

    cy.get(selector).filter(':visible').first().check({ force: true });
    cy.log(`Checked ${fieldName}`);
  });
};

const fieldSelectors = {
  fullName: [
    'input[name="fullName"]',
    'input[name="full_name"]',
    'input[name="name"]',
    '#fullName',
    '#full-name',
    '#name',
    'input[autocomplete="name"]',
    'input[placeholder*="Full name"]',
    'input[placeholder*="full name"]',
    'input[placeholder*="Name"]',
    'input[placeholder*="name"]',
  ],
  businessName: [
    'input[name="businessName"]',
    'input[name="business_name"]',
    'input[name="company"]',
    'input[name="organization"]',
    '#businessName',
    '#business-name',
    '#company',
    'input[placeholder*="Business"]',
    'input[placeholder*="business"]',
    'input[placeholder*="Company"]',
    'input[placeholder*="company"]',
  ],
  email: [
    'input[type="email"]',
    'input[name="email"]',
    '#email',
    'input[autocomplete="email"]',
    'input[placeholder*="email"]',
    'input[placeholder*="Email"]',
  ],
  phone: [
    'input[type="tel"]',
    'input[name="phone"]',
    'input[name="phoneNumber"]',
    'input[name="phone_number"]',
    '#phone',
    '#phoneNumber',
    '#phone-number',
    'input[autocomplete="tel"]',
    'input[placeholder*="phone"]',
    'input[placeholder*="Phone"]',
  ],
  password: [
    'input[name="password"]',
    '#password',
    'input[type="password"]',
    'input[placeholder*="password"]',
    'input[placeholder*="Password"]',
  ],
  confirmPassword: [
    'input[name="confirmPassword"]',
    'input[name="confirm_password"]',
    'input[name="password_confirmation"]',
    '#confirmPassword',
    '#confirm-password',
    'input[placeholder*="confirm"]',
    'input[placeholder*="Confirm"]',
  ],
  terms: [
    'input[name="terms"]',
    'input[name="termsAccepted"]',
    'input[name="acceptTerms"]',
    '#terms',
    '#termsAccepted',
    '#acceptTerms',
  ],
};

describe('RetailRise registration flow', () => {
  it('opens the create-account form and submits registration details', () => {
    const uniqueId = Date.now();
    const loginUrl =
      Cypress.env('RETAILRISE_LOGIN_URL') ||
      'https://retailrise.africa/get-started?mode=login';
    const registration = {
      fullName: Cypress.env('REGISTRATION_FULL_NAME') || 'RetailRise Test User',
      businessName:
        Cypress.env('REGISTRATION_BUSINESS_NAME') ||
        `RetailRise Test Business ${uniqueId}`,
      email:
        Cypress.env('REGISTRATION_EMAIL') ||
        `retailrise.test+${uniqueId}@example.com`,
      phone: Cypress.env('REGISTRATION_PHONE') || '08012345678',
      password:
        Cypress.env('REGISTRATION_PASSWORD') ||
        `RetailRiseTest${uniqueId}!`,
    };

    cy.visit(loginUrl);

    clickVisibleByText('a, button', /create an account/i);

    cy.contains(/create account|create your account|get started|sign up/i, {
      timeout: 10000,
    }).should('be.visible');

    fillOptionalField(
      fieldSelectors.fullName,
      registration.fullName,
      'full name',
    );
    fillOptionalField(
      fieldSelectors.businessName,
      registration.businessName,
      'business name',
    );
    fillRequiredField(fieldSelectors.email, registration.email, 'email');
    fillOptionalField(fieldSelectors.phone, registration.phone, 'phone');
    fillOptionalField(fieldSelectors.password, registration.password, 'password', {
      log: false,
    });
    fillOptionalField(
      fieldSelectors.confirmPassword,
      registration.password,
      'confirm password',
      { log: false },
    );
    checkOptionalBox(fieldSelectors.terms, 'terms');

    clickVisibleByText(
      'button, input[type="submit"]',
      /create account|sign up|register|get started|continue/i,
    );

    cy.contains(/success|welcome|verify|check your email|dashboard|account/i, {
      timeout: 30000,
    }).should('be.visible');
  });
});
