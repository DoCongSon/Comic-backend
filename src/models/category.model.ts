import { Model, model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON, paginate } from './plugins/index.js'
import { Options } from './plugins/paginate.plugin.js'

export interface ICategory extends Document {
  name: string
  slug: string
}

export type CreateCategory = Pick<ICategory, 'name' | 'slug'>

interface ICategoryModel extends Model<ICategory> {
  paginate: (filter: any, options: Options) => Promise<ICategory[]>
  isSlugTaken: (slug: string, excludeCategoryId?: ObjectId | string) => Promise<boolean>
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true }, // Tên thể loại
    slug: { type: String, required: true, unique: true } // Tên không dấu
  },
  { timestamps: true }
)

CategorySchema.plugin(toJSON)
CategorySchema.plugin(paginate)

CategorySchema.statics.isSlugTaken = async function (
  this: Model<ICategory>,
  slug: string,
  excludeCategoryId?: ObjectId | string
) {
  const category = await this.findOne({ slug, _id: { $ne: excludeCategoryId } })
  return !!category
}

export const Category = model<ICategory, ICategoryModel>('Category', CategorySchema)
