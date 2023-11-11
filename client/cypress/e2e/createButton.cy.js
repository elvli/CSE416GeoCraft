describe('Screen Change on Create Button Click', () => {
    it('should change the screen when the "Create" button is clicked', () => {
      // Visit your app's URL or the specific page containing the "Create" button
      cy.visit('https://geocraftmaps.azurewebsites.net/');
  
      // Click the "Create" button
      // cy.contains('Create').click();
  
      // // Check if the "Create" screen contains an h1 with the text "Create"
      // cy.get('h1').should('contain', 'Create');
  
      // // Check if the "name" input field is visible and can be interacted with
      // cy.get('input[name="name"]').should('be.visible').type('John');
  
      // // Check if the "last name" input field is visible and can be interacted with
      // cy.get('input[name="lastName"]').should('be.visible').type('Doe');
  
      // // Check if the "Save to MongoDB" button is visible and can be clicked
      // cy.get('button:contains("Save to MongoDB")').should('be.visible').click();
  
      // // Check if the "Back" button is visible and can be clicked
      // cy.get('button:contains("Back")').should('be.visible').click();
    });
  });
  