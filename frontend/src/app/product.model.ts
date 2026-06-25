/** Mirrors the C# Product model returned by the API (camelCased JSON). */
export interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}
