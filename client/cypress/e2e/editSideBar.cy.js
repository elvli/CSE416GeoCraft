describe('EditSideBar Component', () => {
    beforeEach(() => {
      // Perform login operation
      cy.visit('https://geocraftmaps.azurewebsites.net/login');
      // Input valid login credentials
      cy.get('[name="email"]').type('elvenli54@gmail.com');
      cy.get('[name="password"]').type('123123123');

      // Submit the form
      cy.get('.form-button').click();
      cy.visit('https://geocraftmaps.azurewebsites.net/edit');
    });
  
    it('should edit header on double click', () => {
      cy.get('.accordion-button.collapsed').first().click();
      cy.get('th').first().dblclick();
    });
  
    it('should download JSON on button click', () => {
    cy.get('.accordion-button.collapsed').first().click();
      cy.get('button:contains("Download JSON")').click();
    });
  
    it('should open SaveAndExitModal on close button click', () => {
      cy.get('#edit-close-button').click();
      cy.get('.modal-content').should('be.visible');
    });
  });