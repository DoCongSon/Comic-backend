import { Model, model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON, paginate } from './plugins/index.js'
import { Options } from './plugins/paginate.plugin.js'

export interface IComic extends Document {
  name: string
  vip: boolean
  slug: string
  origin_name: string[]
  content: string
  status: string
  thumb_url: string
  author: string[]
  category: ObjectId[]
  likes: number
  updatedAt: Date
  createdAt: Date
}

export type CreateComic = Pick<
  IComic,
  'name' | 'vip' | 'slug' | 'origin_name' | 'content' | 'status' | 'thumb_url' | 'author' | 'category' | 'likes'
>

type PaginateComic = {
  results: IComic[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}

interface IComicModel extends Model<IComic> {
  paginate: (filter: any, options: Options) => Promise<PaginateComic>
  isSlugTaken: (slug: string, excludeComicId?: ObjectId | string) => Promise<boolean>
}

const ComicSchema = new Schema<IComic>(
  {
    name: { type: String, required: true }, // Tên truyện
    vip: { type: Boolean, default: false }, // Truyện vip
    slug: { type: String, required: true, unique: true }, // Tên không dấu
    origin_name: { type: [String], default: [] }, // Tên gốc
    content: { type: String, default: '' }, // Nội dung
    status: { type: String, enum: ['coming_soon', 'completed', 'ongoing'] }, // Trạng thái
    thumb_url: { type: String, default: '' }, // Ảnh bìa
    author: { type: [String], default: [] }, // Tác giả
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }], // Thể loại
    likes: { type: Number, default: 0 } // Lượt thích
  },
  { timestamps: true }
)

ComicSchema.plugin(toJSON)
ComicSchema.plugin(paginate)

ComicSchema.statics.isSlugTaken = async function (
  this: Model<IComic>,
  slug: string,
  excludeComicId?: ObjectId | string
) {
  const comic = await this.findOne({ slug, _id: { $ne: excludeComicId } })
  return !!comic
}

export const Comic = model<IComic, IComicModel>('Comic', ComicSchema)
