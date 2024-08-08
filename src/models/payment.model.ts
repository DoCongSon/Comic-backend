import { Model, model, Schema, ObjectId, Document } from 'mongoose'
import { toJSON, paginate } from './plugins/index.js'
import { Options } from './plugins/paginate.plugin.js'

export interface IPayment extends Document {
  user: ObjectId
  code: string
  ruby: number
}

export type CreatePayment = Pick<IPayment, 'user' | 'code' | 'ruby'>

interface IPaymentModel extends Model<IPayment> {
  paginate: (filter: any, options: Options) => Promise<IPayment[]>
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    ruby: { type: Number, required: true }
  },
  { timestamps: true }
)

PaymentSchema.plugin(toJSON)
PaymentSchema.plugin(paginate)

export const Payment = model<IPayment, IPaymentModel>('Payment', PaymentSchema)
