const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 25
  },
  favoriteGenre: {
    type: String,
    required: true
  }
})

schema.plugin(uniqueValidator)

const User = mongoose.model('User', schema)
module.exports = User