import crypto from 'crypto'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import db from '../connections/masterDB'
import TUser from 'interfaces/user'

const { Schema } = mongoose

const userSchema: mongoose.Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpired: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret._v
        return ret
      },
    },
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashPass = await bcrypt.hash(this.password, 10)
    this.password = hashPass
    next()
  }
  next()
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// create password reset token
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000 // 10 min
  await this.save()
  return resetToken
}

export default db.model<TUser>('User', userSchema)
