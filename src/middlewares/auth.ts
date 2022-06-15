import logger from '../config/logger'
import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/appError'
import { VerifyToken } from '../utils/jwt'

const auth = async (req: Request, res: Response, next: NextFunction) => {
  console.log('afdkabkajsbfk;abnsdflkasfkahdskbdafbkj')
  logger.info('inside auth middleware')
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      throw new AppError('unauthorized user', 401)
    }
    const decode = VerifyToken(token)
    if (!decode) {
      throw new AppError('Invalid token please login', 401)
    }
    console.log(decode)
    req.user = decode
    next()
  } catch (error: any) {
    next(error)
  }
}

export default auth
