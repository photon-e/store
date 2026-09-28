export type Category = 'men' | 'women' | 'kids';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  /** Price in GBP pence. */
  pricePence: number;
  description: string;
  category: Category;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  /** Unit price in GBP pence. */
  pricePence: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}
