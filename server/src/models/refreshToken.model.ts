import { Schema, model } from 'mongoose'
import config from '../config'
import TimeUtil from '../utils/time.util'

const RefreshTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

RefreshTokenSchema.pre('save', async function (next) {
  this.expireAt = new TimeUtil().secondsFromNow(
    config.REFRESH_TOKEN_EXPIRY_SIGN
  )
  next()
})

const RefreshToken = model('RefreshToken', RefreshTokenSchema)
export default RefreshToken
