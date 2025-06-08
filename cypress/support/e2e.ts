// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Add global styles
import { mount } from 'cypress/react18';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../src/theme';

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      login(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  const { ...mountOptions } = options;

  const wrapped = <ThemeProvider theme={theme}>{component}</ThemeProvider>;

  return mount(wrapped, mountOptions);
});

// Example of a custom command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  // Add any additional assertions or waiting logic here
});
