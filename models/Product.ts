import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['men', 'women', 'kids'], required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }],
    stock: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ProductModel = models.Product || model('Product', ProductSchema);
