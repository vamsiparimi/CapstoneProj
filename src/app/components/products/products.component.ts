import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common'; 

interface Product {
  _id?: string; // Optional
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
  imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  addToCart(product: Product): void {
    console.log('Adding to cart:', product); // Debugging
    this.cartService.addToCart(product);
    alert('Product added to cart!');
  }
}
