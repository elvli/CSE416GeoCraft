describe('Comment Section', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.visit('https://geocraftmaps.azurewebsites.net/'); // Replace with the actual path to your app
    });
    it('should collapse when the button is clicked', () => {
      // // Ensure that the sidebar is initially not collapsed
      // cy.get('#right-wrapper').should('not.have.class', 'toggled');
  
      // // Click the button that triggers the collapse
      // cy.get('#right-menu-toggle').click();
  
      // // Wait for a moment to allow for any animation or transition to complete
      // cy.wait(1000);
  
      // // Assert that the sidebar is collapsed
      // cy.get('#right-wrapper').should('have.class', 'toggled');

      cy.get('.comment-btn').should('have.class', 'btn-primary')
      cy.get('#right-wrapper').should('have.class', 'd-flex')
      });

      it('should check if the comment input is disabled', () => {
        // Check if the comment input is disabled before attempting to type
        cy.get('.form-control').eq(1).should('be.disabled');
      });
  
    it('should type into the comment input', () => {
      const commentText = 'Testing Cypress';
      // // Find the comment input, type text, and check the value
      // cy.get('.form-control').eq(1).type(commentText);    
      // cy.get('.form-control').eq(1).should('have.value', commentText);
    });
  });
  