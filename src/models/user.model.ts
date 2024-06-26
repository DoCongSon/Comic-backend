import { Model, model, Schema, ObjectId, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import { toJSON, paginate } from './plugins/index.js'
import { Options } from './plugins/paginate.plugin.js'
import { userRoles } from '../enums/constants/user.constant.js'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  verified: boolean
  role: string
  isPasswordMatch: (password: string) => Promise<boolean>
}

export type CreateUser = Pick<IUser, 'email' | 'password' | 'name' | 'role'>

interface IUserModel extends Model<IUser> {
  isEmailTaken: (this: Model<IUser>, email: string, excludeUserId?: ObjectId | string) => Promise<boolean>
  isPasswordMatch: (password: string) => Promise<boolean>
  paginate: (filter: any, options: Options) => Promise<IUser[]>
}

export const UserSchema = new Schema<IUser>(
  {
    email: {
      type: 'String',
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { type: 'String', required: true, private: true },
    name: { type: 'String', required: true },
    verified: { type: 'Boolean', default: false },
    role: {
      type: 'String',
      enum: [...Object.values(userRoles)],
      default: userRoles.USER
    }
  },
  { timestamps: true }
)

// add plugin that converts mongoose to json
UserSchema.plugin(toJSON)
UserSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserSchema.statics.isEmailTaken = async function (
  this: Model<IUser>,
  email: string,
  excludeUserId?: ObjectId | string
): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
}

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
UserSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this as IUser
  return bcrypt.compare(password, user.password)
}

/**
 * This is a Mongoose pre-save hook for the UserSchema.
 * It is executed before a document is saved.
 * In this hook, we check if the password field has been modified.
 * If it has, we hash the new password using bcrypt and replace the plain text password with the hashed one.
 * This ensures that we never store plain text passwords in the database.
 *
 * @param {function} next - A callback function that we call when this hook is done.
 * It signals Mongoose to move on to the next middleware waiting to run or to execute the database operation
 * if there are no more middlewares left.
 */
UserSchema.pre('save', async function (next) {
  const user = this as IUser
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

export const User: IUserModel = model<IUser, IUserModel>('User', UserSchema)
