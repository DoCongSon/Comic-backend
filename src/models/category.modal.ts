import { Model, model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON, paginate } from './plugins/index.js'
import { Options } from './plugins/paginate.plugin.js'

export interface ICategory extends Document {
  name: string
  slug: string
}

interface ICategoryModel extends Model<ICategory> {
  paginate: (filter: any, options: Options) => Promise<ICategory[]>
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true }, // Tên thể loại
    slug: { type: String, required: true } // Tên không dấu
  },
  { timestamps: true }
)

CategorySchema.plugin(toJSON)
CategorySchema.plugin(paginate)

export const Category = model<ICategory, ICategoryModel>('Category', CategorySchema)
