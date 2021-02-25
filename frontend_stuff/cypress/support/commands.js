// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('createBlog', (blog) => {
  const token = JSON.parse(localStorage.getItem('loggedBloglistUser')).token

  cy.request({
    method: 'POST',
    url: 'http://localhost:3003/api/blogs',
    body: blog,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})

Cypress.Commands.add('createAndLoginUser', (user) => {
  cy.request('POST', 'http://localhost:3003/api/users', user)
    .then(() => {
      cy.request('POST', 'http://localhost:3003/api/login', user)
        .then(({ body }) => {
          localStorage.setItem('loggedBloglistUser', JSON.stringify(body))
          cy.visit('http://localhost:3000')
        })
    })
})