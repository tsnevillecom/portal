import { Schema, model } from 'mongoose'
import TimeUtil from '../utils/time.util'

const expires = 30

const PasswordTokenSchema = new Schema(
  {
    _userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

PasswordTokenSchema.pre('save', async function (next) {
  this.expireAt = new TimeUtil().minutesFromNow(expires)
  next()
})

const PasswordToken = model('PasswordToken', PasswordTokenSchema)
export default PasswordToken
