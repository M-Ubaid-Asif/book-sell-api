import logger from './config/logger'
import express, { Request, Response, NextFunction, Application } from 'express'
import errorHandler from './helpers/errorHandler'
import router from './components/index'
const app: Application = express()
app.use(express.json())

// loggin all the requests in middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `METHOD - [${req.method}], URL-[${req.url}], IP - [${req.socket.remoteAddress}]`
  )

  res.on('finish', () => {
    logger.info(
      `METHOD - [${req.method}], URL-[${req.url}], IP - [${req.socket.remoteAddress}], status - [${res.statusCode}]`
    )
  })
  next()
})

app.use('/api/v1', router)

// error handler
app.use(errorHandler)

// 404
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('not found')

  return res.status(404).json({
    message: error.message,
  })
})

export default app
