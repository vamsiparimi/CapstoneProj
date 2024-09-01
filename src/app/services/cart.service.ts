import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>([]); 
  private totalSubject = new BehaviorSubject<number>(0); 
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  addToCart(product: any) {
    console.log('Cart before adding:', this.cartSubject.value);
    console.log('Product being added:', product);
    const currentCart = this.cartSubject.value;
    const existingProductIndex = currentCart.findIndex(item => item._id === product._id);
    if (existingProductIndex > -1) {

      const existingProduct = currentCart[existingProductIndex];
      existingProduct.quantity += product.quantity || 1;
      currentCart[existingProductIndex] = existingProduct; 
    } else {
      // Product does not exist, add new
      const newProduct = { ...product, quantity: product.quantity || 1 };
      currentCart.push(newProduct);
    }
    this.cartSubject.next([...currentCart]); // Update cart
    this.updateTotal(); // Update total
    console.log('Cart after adding:', this.cartSubject.value);
  }
  
  

  getCartItems(): Observable<any[]> {
    return this.cartSubject.asObservable();
  }

  getTotal(): Observable<number> {
    return this.totalSubject.asObservable();

  }

  removeFromCart(index: number): void {
    const currentCart = this.cartSubject.value;
    if (index >= 0 && index < currentCart.length) {
      console.log('Removing product from cart'); 
      currentCart.splice(index, 1);
      this.cartSubject.next([...currentCart]);
      this.updateTotal();
    }
  }

  updateQuantity(index: number, change: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart[index];
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(index);
      } else {
        this.cartSubject.next([...currentCart]);
        this.updateTotal();
      }
    }
  }

  clearCart() {
    this.cartSubject.next([]); // Clears the cart
    this.totalSubject.next(0); // Reset total to 0
  }
  

  private updateTotal(): void {
    const total = this.cartSubject.value.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    console.log('Updated total price:', total);
    this.totalSubject.next(total);
  }
}