const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config'

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
  userName: {
    type: String,
    required: true,
    unique: true,
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
  tokens: [
    {
      token: {
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
        expires: 20,
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
  roles: [
    {
      type: 'String',
    },
  ],
  passwordResetToken: String,
  passwordResetExpires: Date,
})

UserSchema.methods.newAccessToken = async function (userAgent) {
  const user = this
  const token = jwt.sign(
    {
      UserInfo: {
        id: user.id.toString(),
        userName: user.userName,
        roles: user.roles,
      },
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '2m' }
  )
  user.tokens = user.tokens.concat({ token, userAgent })
  await user.save()
  return token
}

UserSchema.methods.newRefreshToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user.id.toString() }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  })
  return token
}

UserSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()
  delete userObj.password
  delete userObj.tokens
  delete userObj.isVerified
  return userObj
}

//hash the plain text password before saving
UserSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// UserSchema.pre('remove', async function(next){
//     const user = this
//     await Post.deleteMany({author: user._id})
//     next()
// })

const User = mongoose.model('User', UserSchema)
module.exports = User
