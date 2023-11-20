Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from
  // failing the test when an unhandled exception occurs
  return false;
});

describe('EditSideBar Component', () => {
    beforeEach(() => {
      cy.visit('https://geocraftmaps.azurewebsites.net/edit'); 
    });
  
    // it('should toggle the sidebar on button click', () => {
    //   cy.get('.button.btn.btn-dark').first().click();
    //   cy.get('.button.btn.btn-dark').first().click();
    // });
  
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
      cy.get('.modal-dialog.modal-dialog-centered').should('be.visible');
    });
  });