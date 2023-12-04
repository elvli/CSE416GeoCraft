describe('EditSideBar Component', () => {
    before(() => {
      // Perform login operation
      cy.visit('https://geocraftmaps.azurewebsites.net/login');
      // Input valid login credentials
      cy.get('[name="email"]').type('elvenli54@gmail.com');
      cy.get('[name="password"]').type('123123123');

      // Submit the form
      cy.get('.form-button').click();
    });

    it('should allow you to look at only your owned maps', () => {
      cy.get('.btn.btn-light.my-maps-btn.btn.btn-primary').click();
  
    });
  
    it('should edit header on double click', () => {
      cy.visit('https://geocraftmaps.azurewebsites.net/edit/656d8c18608c296fffc4b6a6');
      cy.get('.accordion-button.collapsed').first().click();
      cy.get('th').first().dblclick();
    });
  
    it('should download JSON on button click', () => {
      cy.visit('https://geocraftmaps.azurewebsites.net/edit/656d8c18608c296fffc4b6a6');
    cy.get('.accordion-button.collapsed').first().click();
      cy.get('button:contains("Download JSON")').click();
    });

    it('should generate a heatmap', () => {
      cy.visit('https://geocraftmaps.azurewebsites.net/edit/656d8c18608c296fffc4b6a6');
    cy.get('.accordion-button.collapsed').eq(1).click();
      cy.get('button:contains("Generate HeatMap")').click();
    });
  
    it('should open SaveAndExitModal on close button click', () => {
      cy.viewport(1200, 800);
      cy.visit('https://geocraftmaps.azurewebsites.net/edit/656d8c18608c296fffc4b6a6');
      cy.get('#edit-close-button').click();
      cy.get('.modal-content').should('be.visible');
    });
  });