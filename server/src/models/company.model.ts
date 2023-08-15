import { Schema, model } from 'mongoose'

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    accountId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    locations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Location',
      },
    ],
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

const Company = model('Company', CompanySchema)
export default Company
