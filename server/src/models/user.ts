import { Schema, model, Model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ROLES from '../config/roles'
import config from '../config'

interface IRefreshToken {
  refreshToken: string
  userAgent: string
}

interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
  refreshTokens: IRefreshToken[]
  isVerified: boolean
  active: boolean
  deleted: boolean
  avatar: string
  role: string
  fullName: string
}

interface IUserMethods {
  newAccessToken(): Promise<string>
  newRefreshToken(): Promise<string>
  toJSON(): { [key: string]: any }
}

type UserModel = Model<IUser, {}, IUserMethods>

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
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
      required: false,
      trim: true,
      minlength: 8,
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
    role: {
      type: String,
      default: ROLES.FAN,
      enum: [ROLES.ADMIN, ROLES.FAN, ROLES.ARTIST, ROLES.INDUSTRY, ROLES.VENUE],
    },
  },
  { timestamps: true }
)

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName
})

UserSchema.methods.newAccessToken = async function () {
  const user = this.toJSON()
  const accessToken = jwt.sign(
    {
      user,
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY_SIGN }
  )
  return accessToken
}

UserSchema.methods.newRefreshToken = async function () {
  const user = this
  const _id = user._id
  const refreshToken = jwt.sign({ _id }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY_SIGN,
  })
  return refreshToken
}

UserSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()
  delete userObj.password
  delete userObj.refreshTokens
  delete userObj.createdAt
  delete userObj.updatedAt
  delete userObj.deleted
  delete userObj.__v
  return userObj
}

//hash the plain text password before saving
UserSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password') && user.password) {
    user.password = await bcrypt.hashSync(user.password, 10)
  }
  next()
})

const User = model<IUser, UserModel>('User', UserSchema)
export default User
