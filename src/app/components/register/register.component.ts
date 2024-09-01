import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/orders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showLogin: boolean = true;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  user: any = null;
  alertVisible: boolean = false;
  alertMessage: string = '';
  showOrders: boolean = false;
  orders: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.isAdmin = this.authService.isAdmin();
      this.user = this.authService.getUser();
      this.loadUserOrders();
    }
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.alertVisible = true;
    setTimeout(() => {
      this.alertVisible = false;
    }, 3000);
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.showAlert('Login successful!');
            this.authService.setAuthData(response);
            this.isLoggedIn = true;
            this.isAdmin = this.authService.isAdmin();
            this.user = response.user;
            this.loadUserOrders();
          } else {
            this.showAlert('Login failed. No response data.');
          }
        },
        (error: any) => {
          this.showAlert('Login failed. Please check your credentials.');
        }
      );
    } else {
      this.showAlert('Please fill out all required fields correctly.');
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.showAlert('Registration successful!');
            this.toggleForm();
          } else {
            this.showAlert('Registration failed. No response data.');
          }
        },
        (error: any) => {
          this.showAlert('Registration failed. Please try again.');
        }
      );
    } else {
      this.showAlert('Please fill out all required fields correctly.');
    }
  }

  toggleForm(): void {
    this.showLogin = !this.showLogin;
  }

  logout(): void {
    this.authService.clearAuthData();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.user = null;
    this.showOrders = false;
    this.showAlert('Logged out successfully!');
  }

  toggleOrders(): void {
    this.showOrders = !this.showOrders;
  }

  loadUserOrders(): void {
    if (this.isAdmin) {
      this.orderService.getAllOrders().subscribe(
        (response: any) => {
          console.log('Fetched all orders:', response);
          this.orders = response.orders || []; 
        },
        (error: any) => {
          console.error('Error fetching all orders:', error);
          this.showAlert('Failed to load orders. Please try again later.');
        }
      );
    } else if (this.user) {
      const userEmail = encodeURIComponent(this.user.email);
      this.orderService.getUserOrders(userEmail).subscribe(
        (response: any) => {
          console.log('Fetched user orders:', response);
          this.orders = response.orders || []; 
        },
        (error: any) => {
          console.error('Error fetching orders:', error);
          this.showAlert('Failed to load orders. Please try again later.');
        }
      );
    } else {
      console.error('User not found');
      this.showAlert('User not found. Please log in again.');
    }
  }
}
