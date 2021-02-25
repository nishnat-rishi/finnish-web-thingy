describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('shows login form by default', function () {
    cy.contains('Username:')
    cy.get('#username-input')
    cy.contains('Password:')
    cy.get('#password-input')
    cy.get('#login-submit')
  })

  describe('when users are presents', function () {
    const user = {
      username: 'lukematherson28',
      name: 'Matti Lukkainen',
      password: 'correct_password474'
    }
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/users', user)
    })

    it('can login with correct credentials', function () {
      cy.get('#username-input')
        .type(user.username)
      cy.get('#password-input')
        .type(user.password)
      cy.get('#login-submit')
        .click()

      cy.get('html')
        .should('contain', `${user.name} logged-in.`)
    })

    it('doesn\'t login with incorrect credentials', function () {
      cy.get('#username-input')
        .type(user.username)
      cy.get('#password-input')
        .type('wrong_password423412')
      cy.get('#login-submit')
        .click()

      cy.get('.failure')
        .should('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html')
        .should('contain', 'Wrong credentials.')
        .and('not.contain', `${user.name} logged-in.`)

    })

    describe('and when a user is logged in', function () {
      beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/login', user)
          .then(({ body }) => {
            localStorage.setItem('loggedBloglistUser', JSON.stringify(body))
            cy.visit('http://localhost:3000')
          })
      })

      it('user can create a new blog', function () {
        const blog = {
          title: 'Good ways to win!',
          author: 'Salainen',
          url: 'spice.com'
        }

        cy.contains('Create New Blog').click()

        cy.get('#title').type(blog.title)
        cy.get('#author').type(blog.author)
        cy.get('#url').type(blog.url)

        cy.contains('Submit').click()

        cy.get('.success')
          .should('have.css', 'color', 'rgb(0, 128, 0)')
          .and('contain', `Blog '${blog.title}' created successfully!`)


        cy.get('.success', { timeout: 6000 })
          .should('not.exist') // waits for success notification to vanish
          // so that the next test doesn't pass due to blog title being
          // present in the notification banner.

        cy.get('html')
          .should('contain', blog.title)
          .and('contain', blog.author)
      })

      describe('and when blogs are persent', function () {
        const blogs = [
          {
            title: 'First blog!',
            author: 'Mocha',
            url: 'mocha.com',
            likes: 423
          },
          {
            title: 'Second blog!',
            author: 'Chai',
            url: 'chai.com',
            likes: 566
          },
          {
            title: 'Third blog!',
            author: 'Chai',
            url: 'cypr.com',
            likes: 349
          }
        ]

        beforeEach(function () {
          for (let blog of blogs) {
            cy.createBlog(blog)
          }

          cy.visit('http://localhost:3000')
        })

        it('allows user to like a blog', function () {
          cy.contains('Second blog!').as('secondBlog')
            .contains('View')
            .click()

          cy.get('@secondBlog')
            .contains('Like')
            .click()

          cy.get('@secondBlog')
            .contains('567')
        })

        it('allows creator to delete their blog', function () {
          cy.contains('Second blog!').as('secondBlog')

          cy.get('html')
            .contains(`${user.name} logged-in.`)

          cy.get('@secondBlog')
            .contains('View')
            .click()

          cy.get('@secondBlog')
            .contains(user.name)

          cy.get('@secondBlog')
            .contains('Remove')
            .click()

          cy.get('#blog-list')
            .should('not.contain', 'Second Blog!') // this happens so fast that we can
            // still see the 'Second Blog!' being present in the browser. Don't worry,
            // it's not actually there!
        })

        it('doesn\'t allow other users to delete someone\'s blog', function () {
          const differentUser = {
            username: 'cristoff29',
            password: 'this_is_for_real',
            name: 'Cristoff Vamonoff'
          }
          cy.createAndLoginUser(differentUser)

          cy.contains('First blog!').as('firstBlog')

          cy.get('@firstBlog')
            .contains('View')
            .click()

          cy.get('@firstBlog')
            .should('not.contain', differentUser.name)
            .and('not.contain', 'Remove')

        })

        it.only('contains blogs in descending order of likes', function () {
          let likes = blogs
            .map(blog => blog.likes)
            .reduce((a, b) => Math.max(a, b))

          cy.get('#blog-list')
            .get('.blog')
            .each(() => {
              cy.contains('View').click()
            })

          cy.get('#blog-list')
            .get('.likes').each($likesItem => {
              const blogLikes = Number($likesItem.contents()[0].data)
              expect(blogLikes).to.be.at.most(likes)
              likes = blogLikes
            })
        })
      })
    })
  })
})