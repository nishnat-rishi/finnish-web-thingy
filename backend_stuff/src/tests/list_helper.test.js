const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }
  ]

  const listWithManyBlogs = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      author: 'Me',
      title: 'Also Me',
      url: 'www.something.com',
      likes: 563,
      id: '602bffb10d55992c98109984'
    },
    {
      author: 'Another one!',
      title: 'Also something else!',
      url: 'www.joke.com',
      likes: 24,
      id: '602c043886e8cd1b340ea743'
    }
  ]

  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(listWithManyBlogs))
      .toBe(5+563+24)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }
  ]

  const listWithOnePopularBlog = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      author: 'Me',
      title: 'Also Me',
      url: 'www.something.com',
      likes: 563,
      id: '602bffb10d55992c98109984'
    },
    {
      author: 'Another one!',
      title: 'Also something else!',
      url: 'www.joke.com',
      likes: 24,
      id: '602c043886e8cd1b340ea743'
    }
  ]

  const listWithManySimilarlyPopularBlogs = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      author: 'Me',
      title: 'Also Me',
      url: 'www.something.com',
      likes: 563,
      id: '602bffb10d55992c98109984'
    },
    {
      author: 'Another one!',
      title: 'Also something else!',
      url: 'www.joke.com',
      likes: 563,
      id: '602c043886e8cd1b340ea743'
    }
  ]


  test('works for one blog', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog))
      .toEqual(
        {
          id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 5,
        }
      )
  })

  test('works for one popular blog', () => {
    expect(listHelper.favoriteBlog(listWithOnePopularBlog))
      .toEqual(
        {
          author: 'Me',
          title: 'Also Me',
          url: 'www.something.com',
          likes: 563,
          id: '602bffb10d55992c98109984'
        }
      )
  })

  test('works for many similarly popular blogs', () => {
    expect(listHelper.favoriteBlog(listWithManySimilarlyPopularBlogs))
      .toEqual(
        {
          author: 'Me',
          title: 'Also Me',
          url: 'www.something.com',
          likes: 563,
          id: '602bffb10d55992c98109984'
        }
      )
  })
})

describe('most likes', () => {
  const blogList = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      author: 'Me',
      title: 'Also Me',
      url: 'www.something.com',
      likes: 563,
      id: '602bffb10d55992c98109984'
    },
    {
      author: 'Me',
      title: 'Also something else!',
      url: 'www.joke.com',
      likes: 24,
      id: '602c043886e8cd1b340ea743'
    },
    {
      author: 'Anotha',
      title: 'Also Me',
      url: 'www.something.com',
      likes: 563,
      id: '602bffb10d55992c98109984'
    },
    {
      author: 'Anotha',
      title: 'Also something else!',
      url: 'www.joke.com',
      likes: 24,
      id: '602c043886e8cd1b340ea743'
    },
    {
      author: 'Anotha',
      title: 'Also something else!',
      url: 'www.joke.com',
      likes: 24,
      id: '602c043886e8cd1b340ea743'
    }
  ]
})