/* 

AUTHOR: Brandon Burt
DATE: 03/06/2023

Frontend E2E Tests are designed to assure the current navigational paths work as should in the UI, as
well as making sure certain permissions work as they should as far as what can be viewed on the 
frontend goes.

*/

describe("Frontend E2E Tests", () => {
    it('successfully performs login flow', () => {
      // visit the 'baseURL'
      cy.visit('http://localhost/login');
      // assert that we are in the right place - search for 'Forgot password?' phrase
      cy.contains('Forgot password?');
      // submit inputs and click submit button
      cy.get('.username-container').type('maruf');
      cy.get('.password-container').type('maruf');
      cy.get('.submitBtn-container').click();
      // verify that we were redirected by asserting the presence of the 'Welcome netid' phrase
      cy.contains('Welcome maruf');
      // click on course dropdown
      cy.get('.topbar-course-dropdown').click();
      // click on course
      cy.get('.topbar-dropdown-bottom').eq(0).click();
      // verify we are logged in via url to page farther into UI
      cy.url().should('include', '/course/1/lecture/1')
    })

    it('user can view homepage', () => {
      // visit the 'baseURL'
      cy.visit('http://localhost/login');
      // assert that we are in the right place - search for 'Forgot password?' phrase
      cy.contains('Forgot password?');
      // submit inputs and click submit button
      cy.get('.username-container').type('maruf');
      cy.get('.password-container').type('maruf');
      cy.get('.submitBtn-container').click();
      // verify that we were redirected by asserting the presence of the 'Welcome netid' phrase
      cy.contains('Welcome maruf');
    })

    it('user can view course', () => {
      // visit the 'baseURL'
      cy.visit('http://localhost/login');
      // assert that we are in the right place - search for 'Forgot password?' phrase
      cy.contains('Forgot password?');
      // submit inputs and click submit button
      cy.get('.username-container').type('maruf');
      cy.get('.password-container').type('maruf');
      cy.get('.submitBtn-container').click();
      // verify that we were redirected by asserting the presence of the 'Welcome netid' phrase
      cy.contains('Welcome maruf');
      // click on course dropdown
      cy.get('.topbar-course-dropdown').click();
      // click on course
      cy.get('.topbar-dropdown-bottom').eq(0).click();
      // assert that we are in the right lecture - search for 'Example Title 14' phrase
      cy.contains('Example Title 14');
    })
    
    it('user in professor role can create poll', () => {
      // visit the 'baseURL'
      cy.visit('http://localhost/login');
      // assert that we are in the right place - search for 'Forgot password?' phrase
      cy.contains('Forgot password?');
      // submit inputs and click submit button
      cy.get('.username-container').type('maruf');
      cy.get('.password-container').type('maruf');
      cy.get('.submitBtn-container').click();
      // verify that we were redirected by asserting the presence of the 'Welcome netid' phrase
      cy.contains('Welcome maruf');
      // click on course dropdown
      cy.get('.topbar-course-dropdown').click();
      // click on course
      cy.get('.topbar-dropdown-bottom').eq(0).click();
      // assert that we are in the right lecture - search for 'Example Title 14' phrase
      cy.contains('Example Title 14');
      // click new poll button
      cy.get('.button-LLLM-new-post').click();
      // verify redirect to new poll occurs - search for 'Enter in your answer choices:' phrase
      cy.contains('Enter in your answer choices:');
      // add poll question
      cy.get('.poll-form-header-input-field').eq(0).type('This is a test poll');
      // add poll result
      cy.get('.poll-form-individual-answer-entry').eq(1).type('Correct answer!');
      // select correct choice
      cy.get('.poll-form-individual-answer-label').eq(0).click();
      // input time allotted for poll
      cy.get('.poll-form-time-available-input').type('3');
      // submit poll
      cy.get('.button-LLLM-new-post').eq(1).click();
      // verify poll is now in live lecture view - search for question 'This is a test poll' phrase
      cy.contains('This is a test poll');
    })
  
    it('user can send a message', () => {
      // visit the 'baseURL'
      cy.visit('http://localhost/login');
      // assert that we are in the right place - search for 'Forgot password?' phrase
      cy.contains('Forgot password?');
      // submit inputs and click submit button
      cy.get('.username-container').type('maruf');
      cy.get('.password-container').type('maruf');
      cy.get('.submitBtn-container').click();
      // verify that we were redirected by asserting the presence of the 'Welcome netid' phrase
      cy.contains('Welcome maruf');
      // click on course dropdown
      cy.get('.topbar-course-dropdown').click();
      // click on course
      cy.get('.topbar-dropdown-bottom').eq(0).click();
      // assert that we are in the right lecture - search for 'Example Title 14' phrase
      cy.contains('Example Title 14');
      cy.get('.lme-textbox').type('Hello World!');
      cy.get('.lme-buttonarea').click();
      cy.reload();
      cy.contains('Hello World!');
    })
})