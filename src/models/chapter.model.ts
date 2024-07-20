import { Model, model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON, paginate } from './plugins/index.js'
import { Options } from './plugins/paginate.plugin.js'

export interface IChapter extends Document {
  comic: ObjectId
  chapter_name: string
  chapter_path: string
  chapter_images: {
    image_page: number
    image_file: string
  }[]
}

export type CreateChapter = Pick<IChapter, 'comic' | 'chapter_name' | 'chapter_path' | 'chapter_images'>

interface IChapterModel extends Model<IChapter> {
  paginate: (filter: any, options: Options) => Promise<IChapter[]>
}

const ChapterSchema = new Schema<IChapter>(
  {
    comic: { type: Schema.Types.ObjectId, ref: 'Comic', required: true }, // Truyện tranh
    chapter_name: { type: String, required: true }, // Tên chapter
    chapter_path: { type: String, required: true }, // Đường dẫn chapter
    chapter_images: [
      {
        image_page: { type: Number, required: true }, // Số thứ tự ảnh
        image_file: { type: String, required: true } // Tên file ảnh
      }
    ]
  },
  { timestamps: true }
)

ChapterSchema.plugin(toJSON)
ChapterSchema.plugin(paginate)

export const Chapter = model<IChapter, IChapterModel>('Chapter', ChapterSchema)
