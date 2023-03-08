const { describe, beforeEach, it } = require("node:test");

describe("Login Flow", () => {
    // visit the 'baseURL'
    cy.visit('http://localhost/login')
    // assert that we are in the right place - search for 'Forgot password?' phrase
    cy.contains('Forgot password?');
    // submit inputs and click submit button
    cy.get(<div className="username-container"><InputField type="text" placeholder="Username" value={this.state.netid ? this.state.netid : ''} onChange={ (val) => this.setInputValue('netid', val) }/></div>).type('maruf');
    cy.get(<div className="password-container"><InputField type="password" placeholder="Password" value={this.state.password ? this.state.password : ''} onChange={ (val) => this.setInputValue('password', val) }/></div>).type('maruf');
    cy.get(<SubmitButton text="Sign in" disabled={this.state.buttonDisabled} onClick={ () => this.doLogin() }/>).click();
    // verify that we were redirected by asserting the presence of the 'Welcome netid' phrase
    cy.contains('Welcome maruf');
})