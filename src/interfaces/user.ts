import { Document } from 'mongoose'

export default interface TUser extends Document {
  email: string
  password: string
  phone: number
  passwordResetToken: string
  passwordResetExpired: Date
  comparePassword: (password: string) => boolean
  createPasswordResetToken: () => string
}
