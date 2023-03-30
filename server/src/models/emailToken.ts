import { Schema, model } from 'mongoose'
import TimeUtil from '../utils/time.util'

const expires = 1

const EmailTokenSchema = new Schema(
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
      default: () => new TimeUtil().daysFromNow(expires),
      index: { expires: `${expires}d` },
    },
  },
  { timestamps: true }
)

const EmailToken = model('EmailToken', EmailTokenSchema)
export default EmailToken
