import { Model, model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON, paginate } from './plugins/index.js'
import { Options } from './plugins/paginate.plugin.js'

export interface IComment extends Document {
  content: string
  user: ObjectId
  comic: ObjectId
  replies: ObjectId[]
}

interface ICommentModel extends Model<IComment> {
  paginate: (filter: any, options: Options) => Promise<IComment[]>
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true }, // Nội dung bình luận
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Người bình luận
    comic: { type: Schema.Types.ObjectId, ref: 'Comic', required: true }, // Truyện
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] // Các câu trả lời
  },
  { timestamps: true }
)

CommentSchema.plugin(toJSON)
CommentSchema.plugin(paginate)

export const Comment = model<IComment, ICommentModel>('Comment', CommentSchema)
