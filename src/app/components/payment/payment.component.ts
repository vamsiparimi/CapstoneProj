import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service'; // Import CartService
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
  cartItems$: Observable<any[]>; // Replace 'any' with the actual type if possible
  subtotal$: Observable<number>;
  total$: Observable<number>;
  shippingCharge: number = 99; // Define shippingCharge here

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService // Inject CartService
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

    // Initialize cartItems$ and subtotal$
    this.cartItems$ = this.cartService.getCartItems();
    this.subtotal$ = this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
    );
    this.total$ = this.subtotal$.pipe(
      map(subtotal => subtotal + this.shippingCharge) // Use shippingCharge here
    );
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.email) {
      this.userEmail = user.email;
    }
  }

  selectPayment(paymentMethod: string): void {
    this.selectedPayment = paymentMethod;
    this.paymentForm.patchValue({ paymentMethod: paymentMethod });
  }

  applyCoupon(): void {
    const coupon = this.paymentForm.get('coupon')?.value;
    console.log('Applying Coupon:', coupon);
    // Implement coupon application logic here
  }

  submitPayment(): void {
    if (this.paymentForm.valid) {
      const paymentDetails = this.paymentForm.value;
      console.log('Payment Details:', paymentDetails);
      // Handle payment submission logic here
    } else {
      console.log('Form is invalid');
    }
  }
}
