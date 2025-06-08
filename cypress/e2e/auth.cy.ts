/// <reference types="cypress" />

describe('Authentication Flows', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const password = 'Test123!';

  beforeEach(() => {
    // Clear local storage and session storage
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/');
  });

  it('allows users to sign up', () => {
    // Navigate to signup page
    cy.visit('/signup');
    
    // Fill in the signup form
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('input[name="terms"]').check();
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify redirect to verify email page
    cy.url().should('include', '/verify-email');
    
    // Check for success message
    cy.contains('Check your email').should('be.visible');
  });

  it('allows users to log in', () => {
    // Create a test user first (you might want to use an API for this in a real test)
    cy.task('createTestUser', { email: testEmail, password });
    
    // Navigate to login page
    cy.visit('/login');
    
    // Fill in the login form
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type(password);
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Check for user email in the dashboard
    cy.contains(testEmail).should('be.visible');
  });

  it('handles invalid login attempts', () => {
    cy.visit('/login');
    
    // Try to log in with invalid credentials
    cy.get('input[name="email"]').type('nonexistent@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Check for error message
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('allows users to reset their password', () => {
    // Navigate to forgot password page
    cy.visit('/forgot-password');
    
    // Fill in the email
    cy.get('input[name="email"]').type(testEmail);
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Check for success message
    cy.contains('Check your email').should('be.visible');
  });
});
