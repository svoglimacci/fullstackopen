describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/tests/reset')
    const user = {
      name: 'Admin',
      username: 'admin',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('log in to application')
  })
  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('admin')
    cy.get('#password').type('password')
    cy.get('#login-button').click()
    cy.contains('Admin logged in')
  })
  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('admin')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()
    cy.get('.error').contains('Wrong credentials')
  })
  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'password' })
    })

    describe('and a blog exists', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'created by cypress', author: 'cypress', url:'go.cypress.io' })
      })

      it('it can be liked', function() {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.get('#likes').contains('1')
      })
      it('it can be deleted', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.contains('created by cypress').should('not.exist')

      })
    })
  })
  describe('blogs ordered by likes', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'password' })
      cy.createBlog({ title: 'created by cypress 1', author: 'cypress', url:'go.cypress.io' })
      cy.createBlog({ title: 'created by cypress 2', author: 'cypress', url:'go.cypress.io' })
      cy.createBlog({ title: 'created by cypress 3', author: 'cypress', url:'go.cypress.io' })

      cy.contains('created by cypress 1').find('button').should('contain', 'view').click()
      cy.contains('created by cypress 1').parent().should('have.class', 'blog').find('button').should('contain', 'like').as('1-like')

      cy.contains('created by cypress 2').find('button').should('contain', 'view').click()
      cy.contains('created by cypress 2').parent().should('have.class', 'blog').find('button').should('contain', 'like').as('2-like')

      cy.contains('created by cypress 3').find('button').should('contain', 'view').click()
      cy.contains('created by cypress 3').parent().should('have.class', 'blog').find('button').should('contain', 'like').as('3-like')
    })
    it('check if blogs are sorted', function() {

      cy.get('@1-like').contains('like').as('like-1')
      cy.get('@like-1').click()
      cy.wait(100)

      cy.get('@2-like').contains('like').as('like-2')
      cy.get('@like-2').click()
      cy.wait(100)
      cy.get('@like-2').click()
      cy.wait(100)

      cy.get('@3-like').contains('like').as('like-3')
      cy.get('@like-3').click()
      cy.wait(100)
      cy.get('@like-3').click()
      cy.wait(100)
      cy.get('@like-3').click()
      cy.wait(100)

      cy.get('div').then(blogs => {
        expect(blogs[0]).to.contain.text('3')
        expect(blogs[1]).to.contain.text('2')
        expect(blogs[2]).to.contain.text('1')
      })
    })
  })
})
