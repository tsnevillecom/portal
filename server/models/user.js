const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY_SIGN,
  REFRESH_TOKEN_EXPIRY_SIGN,
} = require('../config')
const ROLES = require('../config/roles')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid!')
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter your password!')
      } else if (validator.equals(value.toLowerCase(), 'password')) {
        throw new Error('Password is invalid!')
      } else if (validator.contains(value.toLowerCase(), 'password')) {
        throw new Error('Password should not contain password!')
      }
    },
  },
  refreshTokens: [
    {
      refreshToken: {
        type: String,
        required: true,
      },
      userAgent: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  role: {
    type: String,
    default: ROLES.FAN,
    enum: [ROLES.ADMIN, ROLES.FAN, ROLES.ARTIST, ROLES.LABEL],
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
})

UserSchema.methods.newAccessToken = async function () {
  const user = this.toJSON()
  const accessToken = jwt.sign(
    {
      user,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY_SIGN }
  )
  return accessToken
}

UserSchema.methods.newRefreshToken = async function () {
  const user = this
  const _id = user._id

  const refreshToken = jwt.sign({ _id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY_SIGN,
  })
  return refreshToken
}

UserSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()
  delete userObj.password
  delete userObj.refreshTokens
  delete userObj.isVerified
  return userObj
}

//hash the plain text password before saving
UserSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  next()
})

const User = mongoose.model('User', UserSchema)
module.exports = User
