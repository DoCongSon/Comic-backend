import { Model, model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON, paginate } from './plugins/index.js'
import { Options } from './plugins/paginate.plugin.js'

export interface IComic extends Document {
  name: string
  slug: string
  origin_name: string[]
  content: string
  status: string
  thumb_url: string
  author: string[]
  category: ObjectId[]
  chapters: {
    server_name: string
    server_data: ObjectId[]
  }[]

  views: ObjectId
  likes: number
  comments: ObjectId[]
}

interface IComicModel extends Model<IComic> {
  paginate: (filter: any, options: Options) => Promise<IComic[]>
}

const ComicSchema = new Schema<IComic>(
  {
    name: { type: String, required: true }, // Tên truyện
    slug: { type: String, required: true }, // Tên không dấu
    origin_name: { type: [String], default: [] }, // Tên gốc
    content: { type: String, default: '' }, // Nội dung
    status: { type: String, default: 'Đang cập nhật' }, // Trạng thái
    thumb_url: { type: String, default: '' }, // Ảnh bìa
    author: { type: [String], default: [] }, // Tác giả
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }], // Thể loại
    chapters: [
      {
        server_name: { type: String, required: true }, // Tên server
        server_data: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }] // Danh sách chapter
      }
    ],
    views: { type: Schema.Types.ObjectId, ref: 'View' }, // Lượt xem
    likes: { type: Number, default: 0 }, // Lượt thích
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] // Bình luận
  },
  { timestamps: true }
)

ComicSchema.plugin(toJSON)
ComicSchema.plugin(paginate)

export const Comic = model<IComic, IComicModel>('Comic', ComicSchema)
