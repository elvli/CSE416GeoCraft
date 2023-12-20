describe('Comment Section', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.visit('https://geocraftmaps.azurewebsites.net/');
      cy.get('.card.map-card').eq(0).click()
    });
    it('should collapse when the button is clicked', () => {
      });

      it('should check if the comment input is disabled', () => {
        // Check if the comment input is disabled before attempting to type
        cy.get('.form-control').eq(1).should('be.disabled');
      });
  
    it('should type into the comment input', () => {
      cy.on('uncaught:exception', (err, runnable) => {
        // Returning false here prevents Cypress from failing the test
        return false;
      });
      // Perform login operation
      cy.visit('https://geocraftmaps.azurewebsites.net/login');
      // Input valid login credentials
      cy.get('[name="email"]').type('elvenli54@gmail.com');
      cy.get('[name="password"]').type('123123123');

      // Submit the form
      cy.get('.form-button').click();

      cy.get('.card.map-card').eq(0).click()
      const commentText = 'Testing Cypress';
      // Find the comment input, type text, and check the value
      cy.get('.form-control').eq(1).type(commentText);    
      cy.get('.form-control').eq(1).should('have.value', commentText);
    });
  });
  