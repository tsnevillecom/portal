import { Schema, model } from 'mongoose'

const MessageSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

MessageSchema.methods.toJSON = function () {
  const message = this
  const messageObj = message.toObject()
  delete messageObj.deleted
  delete messageObj.__v
  return messageObj
}

const Message = model('Message', MessageSchema)
export default Message
