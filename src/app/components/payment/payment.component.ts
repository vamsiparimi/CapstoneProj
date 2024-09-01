import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/orders.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  selectedPayment: string | null = null;
  userEmail: string = '';
  cartItems$: Observable<any[]>;
  subtotal$: Observable<number>;
  total$: Observable<number>;
  shippingCharge: number = 99;
  showAlert: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      username: ['', Validators.required],
      coupon: [''],
      country: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', Validators.required],
      phone: ['', Validators.required],
      paymentMethod: ['', Validators.required],
    });

    this.cartItems$ = this.cartService.getCartItems();
    this.subtotal$ = this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
    );
    this.total$ = this.subtotal$.pipe(
      map(subtotal => subtotal + this.shippingCharge)
    );
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.email) {
      this.userEmail = user.email;
      this.paymentForm.patchValue({ username: this.userEmail });
    }
  }

  selectPayment(paymentMethod: string): void {
    this.selectedPayment = paymentMethod;
    this.paymentForm.patchValue({ paymentMethod: paymentMethod });
  }

  applyCoupon(): void {
    const coupon = this.paymentForm.get('coupon')?.value;
    console.log('Applying Coupon:', coupon);
  }

  submitPayment(): void {
    if (this.paymentForm.valid) {
      const paymentDetails = this.paymentForm.value;
  
      this.cartItems$.subscribe(cartItems => {
        const orderDetails = {
          products: cartItems,
          totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: paymentDetails.totalPrice,
          name: `${paymentDetails.firstName} ${paymentDetails.lastName}`,
          email: this.userEmail,
          address: `${paymentDetails.address}, ${paymentDetails.city}, ${paymentDetails.state}, ${paymentDetails.pinCode}`,
          contactNumber: paymentDetails.phone,
          dateOfOrder: new Date(),
          paymentMethod: paymentDetails.paymentMethod
        };
  
        this.orderService.saveOrder(orderDetails).subscribe(
          response => {
            console.log('Order saved successfully:', response);
            this.cartService.clearCart(); // Clear the cart
            this.showAlert = true;
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 10000); 
          },
          error => {
            console.error('Error saving order:', error);
          }
        );
      });
    } else {
      console.log('Form is invalid');
    }
  }
  
  

  hideAlert(): void {
    this.showAlert = false;
    this.router.navigate(['/products']);
  }
}
