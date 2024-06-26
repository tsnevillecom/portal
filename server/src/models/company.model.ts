import { Schema, model } from 'mongoose'

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      unique: true,
    },
    accountId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['DSO', 'PRIVATE'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    fax: {
      type: String,
      required: false,
      trim: true,
    },
    address1: {
      type: String,
      required: true,
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      required: true,
      minLength: 2,
      maxLength: 2,
    },
    postalCode: {
      type: String,
      trim: true,
      required: true,
      minLength: 5,
    },
    countryCode: {
      type: String,
      trim: true,
      default: 'US',
      minLength: 2,
      maxLength: 2,
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
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const Company = model('Company', CompanySchema)
export default Company
