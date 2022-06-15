import db from 'connections/masterDB.js'
import mongoose from 'mongoose'

const { Schema } = mongoose

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default db.model('Book', bookSchema)
