import mongoose from 'mongoose'

const { schema } = mongoose

const UserSchema = new Schema(
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
      defaults: ['Subscriber'],
      enum: ['Subscriber', 'instructor', 'Admin'],
    },
    sctripe_account_id: '',
    stripe_seller: {},
    stripeSession: {},
  },

  { timestamps: true }
)

export default mongoose.model('User', UserSchema)
