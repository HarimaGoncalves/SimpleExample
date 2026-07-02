/** Mirrors the C# Product model returned by the API (camelCased JSON). */
export type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
};
