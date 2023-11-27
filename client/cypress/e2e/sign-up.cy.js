describe('Sign Up', () => {
    beforeEach(() => {
      // Perform login operation
      cy.visit('https://geocraftmaps.azurewebsites.net/sign-up');
    });
    it('should handle various sign-up error scenarios', () => {
        // Attempt to sign up with incomplete form
        cy.get('button[type="submit"]').click();
      
        // Attempt to sign up with invalid email format
        cy.get('[name="email"]').type('invalidemail');
        cy.get('button[type="submit"]').click();
        cy.get('.sign-up-error-message').should('contain', 'Emails do not match.');
      });
      
    it('should display error messages for invalid inputs', () => {
        // Invalid input causing email match error
        cy.get('[name="email"]').type('john.doe@example.com');
        cy.get('[name="confirmEmail"]').type('different.email@example.com');
        cy.get('button[type="submit"]').click();
        cy.get('.sign-up-error-message').should('contain', 'Emails do not match.');
      });

      it('should display an error message for a short password', () => {
        cy.get('[name="firstName"]').type('Jane');
        cy.get('[name="lastName"]').type('Doe');
        cy.get('[name="username"]').type('janedoe');
        cy.get('[name="email"]').type('jane.doe@example.com');
        cy.get('[name="confirmEmail"]').type('jane.doe@example.com');
        cy.get('[name="password"]').type('short'); // Password less than 8 characters
        cy.get('[name="confirmPassword"]').type('short');
        cy.get('button[type="submit"]').click();
      
        // Assert that the password length error message is displayed
        cy.get('.sign-up-error-message').should('contain', 'Password must be at least 8 characters.');
      });

      it('should display an error message for mismatched passwords', () => {
        cy.get('[name="firstName"]').type('Alice');
        cy.get('[name="lastName"]').type('Johnson');
        cy.get('[name="username"]').type('alicejohnson');
        cy.get('[name="email"]').type('alice.johnson@example.com');
        cy.get('[name="confirmEmail"]').type('alice.johnson@example.com');
        cy.get('[name="password"]').type('securepassword');
        cy.get('[name="confirmPassword"]').type('differentpassword'); // Mismatched password
        cy.get('button[type="submit"]').click();
      
        // Assert that the password match error message is displayed
        cy.get('.sign-up-error-message').should('contain', 'Passwords do not match.');
      
      });
      
      
    
    });