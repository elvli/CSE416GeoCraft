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

  it('should download JSON on button click', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('.accordion-button.collapsed').last().click();
    cy.get('button:contains("Download JSON")').click();
  });

  it('should generate a heatmap', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#my_file_input').click();
  });

  it('should open SaveAndExitModal on close button click', () => {
    cy.viewport(1200, 800);
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#edit-close-button').click();
    cy.get('.modal-content').should('be.visible');
  });

  it('should toggle sidebar', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#edit-left-tool .edit-button').eq(0).click();
  });

  it('should handle save', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#edit-left-tool .edit-button').eq(1).click();
  });

  it('should not undo', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#edit-left-tool .edit-button').eq(2).should('not.be.visible');
  });

  it('should not redo', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#edit-left-tool .edit-button').eq(3).should('not.be.visible');
  });

  it('should show map name modal', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#edit-left-tool .edit-button').eq(4).click();
  });

  it('should show close modal', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#edit-left-tool #edit-close-button').click();
  });

  it('should show publish modal', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('#edit-left-tool .edit-button').eq(5).click();
  });

  it('should go to home page', () => {
    cy.visit('https://geocraftmaps.azurewebsites.net/edit/6582a76a8eebaa5e249b13a2');
    cy.get('.app-banner .home-button').click();
  });
});