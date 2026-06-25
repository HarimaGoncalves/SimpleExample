import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main>
      <h1>Products</h1>

      <form class="add-form" (ngSubmit)="add()">
        <input
          type="text"
          name="name"
          placeholder="Name"
          [(ngModel)]="newName"
          required
        />
        <input
          type="number"
          name="price"
          step="0.01"
          min="0"
          placeholder="Price"
          [(ngModel)]="newPrice"
          required
        />
        <label>
          <input type="checkbox" name="inStock" [(ngModel)]="newInStock" />
          In stock
        </label>
        <button type="submit">Add product</button>
      </form>

      @if (loading()) {
        <p class="muted">Loading…</p>
      } @else if (products().length === 0) {
        <p class="muted">No products yet. Add one above.</p>
      } @else {
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
            @for (product of products(); track product.id) {
              <tr>
                <td>{{ product.name }}</td>
                <td>{{ product.price | currency }}</td>
                <td>
                  <input
                    type="checkbox"
                    [checked]="product.inStock"
                    (change)="toggleStock(product)"
                  />
                </td>
                <td>
                  <button class="link" (click)="remove(product)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </main>
  `,
})
export class AppComponent implements OnInit {
  // Component state held in signals.
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  // Two-way bound form fields.
  newName = '';
  newPrice: number | null = null;
  newInStock = true;

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.loading.set(false);
      },
    });
  }

  add(): void {
    if (!this.newName.trim() || this.newPrice == null) {
      return;
    }
    this.productService
      .create({ name: this.newName.trim(), price: this.newPrice, inStock: this.newInStock })
      .subscribe((created) => {
        this.products.update((list) => [...list, created]);
        this.newName = '';
        this.newPrice = null;
        this.newInStock = true;
      });
  }

  toggleStock(product: Product): void {
    const updated: Product = { ...product, inStock: !product.inStock };
    this.productService.update(product.id, updated).subscribe(() => {
      this.products.update((list) =>
        list.map((p) => (p.id === product.id ? updated : p)),
      );
    });
  }

  remove(product: Product): void {
    this.productService.delete(product.id).subscribe(() => {
      this.products.update((list) => list.filter((p) => p.id !== product.id));
    });
  }
}
