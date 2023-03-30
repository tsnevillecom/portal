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
      required: true,
      default: () => new TimeUtil().minutesFromNow(expires),
      index: { expires: `${expires}m` },
    },
  },
  { timestamps: true }
)

const PasswordToken = model('PasswordToken', PasswordTokenSchema)
export default PasswordToken
