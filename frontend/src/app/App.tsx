import React, { useEffect, useState } from 'react';
import { Product } from './product.model';
import { useProductService } from './product.service';

export const App: React.FC = () => {
  const service = useProductService();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [newInStock, setNewInStock] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await service.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (): Promise<void> => {
    if (!newName.trim() || newPrice == null) {
      return;
    }
    try {
      const created = await service.create({
        name: newName.trim(),
        price: newPrice,
        inStock: newInStock,
      });
      setProducts((list) => [...list, created]);
      setNewName('');
      setNewPrice(null);
      setNewInStock(true);
    } catch (err) {
      console.error('Failed to create product', err);
    }
  };

  const toggleStock = async (product: Product): Promise<void> => {
    const updated: Product = { ...product, inStock: !product.inStock };
    try {
      await service.update(product.id, updated);
      setProducts((list) =>
        list.map((p) => (p.id === product.id ? updated : p))
      );
    } catch (err) {
      console.error('Failed to update product', err);
    }
  };

  const remove = async (product: Product): Promise<void> => {
    try {
      await service.delete(product.id);
      setProducts((list) => list.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <main>
      <h1>Products</h1>

      <form className="add-form" onSubmit={(e) => { e.preventDefault(); add(); }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          type="number"
          name="price"
          step="0.01"
          min="0"
          placeholder="Price"
          value={newPrice ?? ''}
          onChange={(e) => setNewPrice(e.target.value ? parseFloat(e.target.value) : null)}
          required
        />
        <label>
          <input
            type="checkbox"
            name="inStock"
            checked={newInStock}
            onChange={(e) => setNewInStock(e.target.checked)}
          />
          In stock
        </label>
        <button type="submit">Add product</button>
      </form>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : products.length === 0 ? (
        <p className="muted">No products yet. Add one above.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>In stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={product.inStock}
                    onChange={() => toggleStock(product)}
                  />
                </td>
                <td>
                  <button className="link" onClick={() => remove(product)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};
