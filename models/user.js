import mongoose from 'mongoose'
const { Schema } = mongoose
const { ObjectId } = Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    picture: {
      type: String,
      default: '/avatar.png',
    },
    role: {
      type: [String],
      default: ['Subscriber'],
      enum: ['Subscriber', 'Instructor', 'Admin'],
    },
    stripe_account_id: { type: String, default: '' },
    stripe_seller: {},
    stripeSession: {},
    passwordResetCode: {
      type: String,
      default: '',
    },
    courses: [{ type: ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
