import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [CurrencyPipe]
})
export class CheckoutComponent implements OnInit {
  cartItems$: Observable<any[]>;
  total$: Observable<number>;

  constructor(
    private cartService: CartService, 
    private currencyPipe: CurrencyPipe,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.getCartItems();
    this.total$ = this.cartService.getTotal();
  }

  ngOnInit(): void {}

  removeFromCart(index: number): void {
      this.cartService.removeFromCart(index);
    }
  

  proceedToCheckout(): void {
    this.router.navigate(['/payment']);
    console.log('Proceeding to checkout');
  }

  updateQuantity(index: number, change: number): void {
    this.cartService.updateQuantity(index, change);
  }
}