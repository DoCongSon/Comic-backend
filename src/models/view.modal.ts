import { model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON } from './plugins/index.js'

export interface IView extends Document {
  totalViews: number // Tổng lượt xem
  dailyViews: ObjectId[] // Lượt xem theo ngày
  weeklyViews: ObjectId[] // Lượt xem theo tuần
  monthlyViews: ObjectId[] // Lượt xem theo tháng
}

export interface IViewOfDate {
  date: Date // Ngày xem
  views: number // Số lượt xem trong ngày đó
}

const ViewOfDateSchema = new Schema<IViewOfDate>(
  {
    date: { type: Date, default: Date.now }, // Ngày xem
    views: { type: Number, default: 1 } // Số lượt xem trong ngày đó
  },
  { _id: false }
)

export const ViewSchema = new Schema<IView>(
  {
    totalViews: { type: Number, default: 0 }, // Tổng lượt xem
    dailyViews: [ViewOfDateSchema], // Lượt xem theo ngày
    weeklyViews: [ViewOfDateSchema], // Lượt xem theo tuần
    monthlyViews: [ViewOfDateSchema] // Lượt xem theo tháng
  },
  { timestamps: true }
)

ViewSchema.plugin(toJSON)

export const View = model<IView>('View', ViewSchema)
