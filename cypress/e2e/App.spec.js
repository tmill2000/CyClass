const { describe, beforeEach, it } = require("node:test");

describe("Login Tests", () => {
    beforeEach(() => {
        cy.visit('http://localhost/login')
    })

    it("should login once correct credentials entered, and submitted", () => {
        cy.get('#')
    })
})