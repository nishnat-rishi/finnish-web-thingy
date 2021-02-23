require('dotenv').config()

let BLOGLIST_MONGODB_URI = process.env.BLOGLIST_MONGODB_URI
const PORT = process.env.PORT

if (process.env.NODE_ENV === 'test') {
  BLOGLIST_MONGODB_URI = process.env.BLOGLIST_TEST_MONGODB_URI
}

module.exports = {
  BLOGLIST_MONGODB_URI,
  PORT
}