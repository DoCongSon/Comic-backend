import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { Options } from '../models/plugins/paginate.plugin.js'

export const queryUsers = async (filter: any, options: Options) => {
  const users = await User.paginate(filter, options)
  return users
}
