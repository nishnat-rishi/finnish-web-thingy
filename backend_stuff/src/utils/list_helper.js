const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likesList = blogs.map(blog => blog.likes)
  return likesList.reduce((sum, likes) => sum + likes, 0)
}

const favoriteBlog = (blogs) => {
  const likesList = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...likesList)
  return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = _.countBy(blogs, 'author')
  const mostBlogsPair = _.maxBy(_.toPairs(blogsByAuthor), 1)
  return { author: mostBlogsPair[0], blogs: mostBlogsPair[1] }
}

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  const authorAndLikes = []
  _.forEach(blogsByAuthor, (blog, authorName) =>
    authorAndLikes.push({
      author: authorName,
      likes: _.sumBy(blog, 'likes')
    })
  )
  return _.maxBy(authorAndLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
