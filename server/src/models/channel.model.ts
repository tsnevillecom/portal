import { Schema, model } from 'mongoose'

const ChannelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

ChannelSchema.methods.toJSON = function () {
  const channel = this
  const channelObj = channel.toObject()
  delete channelObj.createdAt
  delete channelObj.updatedAt
  return channelObj
}

ChannelSchema.pre('find', function (next) {
  const select = '_id firstName lastName active'
  this.populate([
    { path: 'createdBy', select },
    { path: 'members', select },
  ])
  next()
})

const Channel = model('Channel', ChannelSchema)
export default Channel
