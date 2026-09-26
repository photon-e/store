import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        size: String,
        color: String,
        pricePence: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    subtotalPence: Number,
    taxPence: Number,
    totalPence: Number,
    status: { type: String, default: 'paid' },
    stripePaymentIntentId: String,
    stripeCheckoutSessionId: String,
  },
  { timestamps: true },
);

export const OrderModel = models.Order || model('Order', OrderSchema);
