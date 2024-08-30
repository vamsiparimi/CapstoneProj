import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  _id?: string;
  image?: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, FormsModule]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  showAlert = false;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  extractCategories(): void {
    this.categories = [...new Set(this.products.map(product => product.category))];
  }

  filterProductsByCategory(): void {
    if (this.selectedCategory) {
      this.filteredProducts = this.products.filter(product => product.category === this.selectedCategory);
    } else {
      this.filteredProducts = this.products;
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }
}
