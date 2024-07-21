import { model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON } from './plugins/index.js'

export interface IView extends Document {
  comic: ObjectId // Truyện tranh
  totalViews: number // Tổng lượt xem
  dailyViews: ObjectId[] // Lượt xem theo ngày
  weeklyViews: ObjectId[] // Lượt xem theo tuần
  monthlyViews: ObjectId[] // Lượt xem theo tháng
}

export type CreateView = Pick<IView, 'comic' | 'totalViews' | 'dailyViews' | 'weeklyViews' | 'monthlyViews'>

export interface IViewOfDate extends Document {
  date: Date // Ngày xem
  views: number // Số lượt xem trong ngày đó
}

export type CreateViewOfDate = Pick<IViewOfDate, 'date' | 'views'>

const ViewOfDateSchema = new Schema<IViewOfDate>(
  {
    date: { type: Date, default: Date.now }, // Ngày xem
    views: { type: Number, default: 1 } // Số lượt xem trong ngày đó
  },
  { _id: false }
)

export const ViewSchema = new Schema<IView>(
  {
    comic: { type: Schema.Types.ObjectId, ref: 'Comic', required: true }, // Truyện tranh
    totalViews: { type: Number, default: 0 }, // Tổng lượt xem
    dailyViews: [ViewOfDateSchema], // Lượt xem theo ngày
    weeklyViews: [ViewOfDateSchema], // Lượt xem theo tuần
    monthlyViews: [ViewOfDateSchema] // Lượt xem theo tháng
  },
  { timestamps: true }
)

ViewSchema.plugin(toJSON)

export const View = model<IView>('View', ViewSchema)
