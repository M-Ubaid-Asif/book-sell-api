import { Document } from 'mongoose'

export default interface TUser extends Document {
  email: string
  password: string
  phone: number
  passwordResetToken: string
  passwordResetExpired: Date
  isDeleted: boolean
  comparePassword: (password: string) => boolean
  createPasswordResetToken: () => string
}
