const mongoose = require('mongoose')

const PasswordTokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: '30m' },
  },
})

const PasswordToken = mongoose.model('PasswordToken', PasswordTokenSchema)
module.exports = PasswordToken
