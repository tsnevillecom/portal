import { Schema, model } from 'mongoose'

const LocationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    taxId: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address1: {
      type: String,
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
      minLength: 2,
      maxLength: 2,
    },
    postalCode: {
      type: String,
      trim: true,
      minLength: 5,
    },
    countryCode: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 2,
    },
    description: {
      type: String,
      trim: true,
    },
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

const Location = model('Location', LocationSchema)
export default Location
