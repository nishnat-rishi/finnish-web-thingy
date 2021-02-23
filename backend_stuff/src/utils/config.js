require('dotenv').config()

const PORT = process.env.PORT
let NOTEAPP_MONGODB_URI = process.env.NOTEAPP_MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  NOTEAPP_MONGODB_URI = process.env.NOTEAPP_TEST_MONGODB_URI
}

module.exports = {
  NOTEAPP_MONGODB_URI,
  PORT
}