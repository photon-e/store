import { Category } from '@/types';

const CATEGORIES: Category[] = ['men', 'women', 'kids'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ProductInput = {
  name: string;
  slug: string;
  pricePence: number;
  description: string;
  category: Category;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
};

export class ProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductValidationError';
  }
}

function requiredString(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) throw new ProductValidationError(`${field} is required.`);
  return value.trim();
}

function stringArray(value: unknown, field: string) {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new ProductValidationError(`${field} must contain at least one value.`);
  }
  return [...new Set(value.map((item) => item.trim()))];
}

export function parseProductInput(body: unknown): ProductInput {
  if (!body || typeof body !== 'object') throw new ProductValidationError('A product payload is required.');
  const input = body as Record<string, unknown>;
  const name = requiredString(input.name, 'Name');
  const slug = requiredString(input.slug, 'Slug').toLowerCase();
  const description = requiredString(input.description, 'Description');

  if (!SLUG_PATTERN.test(slug)) {
    throw new ProductValidationError('Slug may contain only lowercase letters, numbers, and hyphens.');
  }
  if (!CATEGORIES.includes(input.category as Category)) {
    throw new ProductValidationError('Category must be men, women, or kids.');
  }
  if (!Number.isInteger(input.pricePence) || (input.pricePence as number) < 0) {
    throw new ProductValidationError('Price must be a non-negative whole number of pence.');
  }
  if (!Number.isInteger(input.stock) || (input.stock as number) < 0) {
    throw new ProductValidationError('Stock must be a non-negative whole number.');
  }

  const images = stringArray(input.images, 'Images');
  if (images.some((image) => !image.startsWith('/') && !/^https:\/\//.test(image))) {
    throw new ProductValidationError('Each image must be a local path or an HTTPS URL.');
  }

  return {
    name,
    slug,
    description,
    category: input.category as Category,
    pricePence: input.pricePence as number,
    stock: input.stock as number,
    sizes: stringArray(input.sizes, 'Sizes'),
    colors: stringArray(input.colors, 'Colours'),
    images,
  };
}
