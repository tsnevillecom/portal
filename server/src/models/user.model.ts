import { Schema, model, Model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ROLES from '../config/roles'
import config from '../config'

interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
  isVerified: boolean
  active: boolean
  online: boolean
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      default: ROLES.USER,
      enum: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER, ROLES.GUEST],
    },
  },
  { timestamps: true }
)

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName
})

UserSchema.methods.newAccessToken = async function () {
  const user = this
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
  delete userObj.createdAt
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
