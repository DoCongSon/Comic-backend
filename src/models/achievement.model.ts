import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose'
import { paginate, toJSON } from './plugins/index.js'

export interface IAchievement extends Document {
  name: string
  description: string
}

export type CreateAchievement = IAchievement

export interface IAchievementModel extends Model<IAchievement> {
  paginate: (filter: any, options: any) => Promise<IAchievement[]>
  isNameTaken: (name: string, excludeUserId?: ObjectId | string) => Promise<boolean>
}

export const achievementSchema = new Schema<IAchievement>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// add plugin that converts mongoose to json
achievementSchema.plugin(toJSON)
achievementSchema.plugin(paginate)

/**
 * Check if name is taken
 * @param {string} name - The achievement's name
 * @param {ObjectId} [excludeUserId] - The id of the achievement to be excluded
 * @returns {Promise<boolean>}
 */
achievementSchema.statics.isNameTaken = async function (
  this: Model<IAchievement>,
  name: string,
  excludeUserId?: ObjectId | string
) {
  const achievement = await this.findOne({ name, _id: { $ne: excludeUserId } })
  return !!achievement
}

export const Achievement: IAchievementModel = mongoose.model<IAchievement, IAchievementModel>(
  'Achievement',
  achievementSchema
)
