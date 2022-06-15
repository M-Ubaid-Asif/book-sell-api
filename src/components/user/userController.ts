import { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'

import { GenerateToken } from '../../utils/jwt'
import AppError from '../../utils/appError'
import {
  createUser,
  findAndDelete,
  findAndUpdate,
  finduserBy,
} from './userService'
import sendEmail from '../../utils/email'
import logger from '../../config/logger'
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, phone } = req.body
    if (!email || !password || !phone) {
      throw new AppError('all fields are required', 400)
    }

    const isExist = await finduserBy({ email }, 'email')
    console.log(isExist)
    if (isExist) {
      throw new AppError('email is already registerd', 400)
    }
    const doc = await createUser({ email, password, phone })
    if (!doc) {
      throw new AppError('failed to create user', 400)
    }
    const token = GenerateToken({ _id: doc._id, email: doc.email })
    return res.status(200).json({ data: { _id: doc._id, token } })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    const user = await finduserBy({ email }, 'email password phone')

    if (!user) {
      throw new AppError('Invalid Credentials', 401)
    }
    const isValid = await user.comparePassword(password)

    if (!isValid) {
      throw new AppError('Invalid Credentials', 401)
    }

    const token = GenerateToken({ _id: user._id, email })

    return res.status(200).json({
      message: 'success',
      data: {
        token,
        id: user._id,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.user._id
    const updatedDoc = await findAndUpdate(_id, req.body)
    if (!updatedDoc) {
      throw new AppError('Failed to update user', 400)
    }
    return res.status(200).json({
      status: 'success',
      message: 'updated successfully',
      data: updatedDoc,
    })
  } catch (error) {
    next(error)
  }
}

export const fogetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info('inside forget password controller')
    const { email } = req.body
    const user = await finduserBy({ email }, 'email')

    if (!user) {
      throw new AppError('email not found', 400)
    }
    const resetToken = await user.createPasswordResetToken()

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/resetPassword/${resetToken}`

    const text = `Forgot your password?\nReset your password here ${resetUrl}\nif you do not forgot your password, Please ignore this email\n your password is only valid for 10 min`

    const mailed = await sendEmail({
      email: user.email,
      subject: 'forgot password',
      message: text,
    })

    if (!mailed) {
      throw new AppError('failed to send email', 500)
    }
    return res.status(200).json({
      status: 'success',
      message: 'password reset link successfully sent',
    })
  } catch (error: any) {
    next(error)
  }
}

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword, confirmPassword } = req.body
    const token = req.params.token
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await finduserBy(
      {
        passwordResetToken,
        passwordResetExpired: { $gt: Date.now() },
      },
      'phone email password passwordResetToken passwordResetExpired'
    )

    if (!user) {
      throw new AppError('password reset link has been expired!', 400)
    }

    if (newPassword !== confirmPassword) {
      throw new AppError('password reset link has been expired!', 400)
    }

    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpired = undefined
    await user.save()
    return res.status(200).json({
      statau: 'Success',
      message: 'password successfully changed',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id
    const doc = await findAndDelete({ _id })
    if (!doc) {
      throw new AppError('invalid user or already deleted user', 400)
    }
    return res.status(200).json({
      status: 'success',
      message: 'user deleted!',
    })
  } catch (error) {
    next(error)
  }
}
