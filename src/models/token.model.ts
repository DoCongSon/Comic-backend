import mongoose, { Document, Schema } from 'mongoose'
import { toJSON } from './plugins/index.js'
import { tokenTypes } from '../enums/constants/token.constant.js'

export interface IToken extends Document {
  token: string
  user: Schema.Types.ObjectId
  type: string
  expires: Date
  blacklisted: boolean
}

export const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: [...Object.values(tokenTypes)],
      required: true
    },
    expires: {
      type: Date,
      required: true
    },
    blacklisted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON)

export const Token = mongoose.model<IToken>('Token', tokenSchema)
