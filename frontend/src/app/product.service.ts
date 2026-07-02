import { Product } from './product.model';

const baseUrl = '/api/products';

/**
 * Talks to the C# Web API. Requests go to /api/products and are forwarded to
 * the backend (http://localhost:5000) by the dev-server proxy.
 */
export const useProductService = () => {
  const getAll = async (): Promise<Product[]> => {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  };

  const create = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  };

  const update = async (id: number, product: Product): Promise<void> => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
  };

  const delete_ = async (id: number): Promise<void> => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  };

  return { getAll, create, update, delete: delete_ };
};
