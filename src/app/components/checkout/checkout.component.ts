import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [CurrencyPipe]
})
export class CheckoutComponent implements OnInit {
  cartItems$: Observable<any[]>; // Use Observable for cart items
  total$: Observable<number>; // Use Observable for total price

  constructor(private cartService: CartService, private currencyPipe: CurrencyPipe) {
    this.cartItems$ = this.cartService.getCartItems(); // Initialize cartItems$ with observable
    this.total$ = this.cartService.getTotal(); // Initialize total$ with observable
  }

  ngOnInit(): void {}

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index); // Call removeFromCart method in CartService
  }

  proceedToCheckout(): void {
    console.log('Proceeding to checkout');
  }

  updateQuantity(index: number, change: number): void {
    this.cartService.updateQuantity(index, change); // Call updateQuantity method in CartService
  }
}
