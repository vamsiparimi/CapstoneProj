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
  isAdmin = false;
  user: any = null;
  alertVisible: boolean = false;
  alertMessage: string = '';
  showOrders: boolean = false;
  orders: any[] = []; // Array to hold user orders

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService // Inject OrderService
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
    console.log('Initializing RegisterComponent');
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.isAdmin = this.authService.isAdmin();
      this.user = this.authService.getUser();
      this.loadUserOrders(); // Load user orders on initialization
    }
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.alertVisible = true;
    setTimeout(() => {
      this.alertVisible = false;
    }, 3000); // Alert disappears after 3 seconds
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response) {
            console.log('User logged in:', response);
            this.showAlert('Login successful!');
            this.authService.setAuthData(response);
            this.isLoggedIn = true;
            this.user = response.user;
            this.loadUserOrders(); // Load user orders after login
          } else {
            console.error('Login failed. No response data.');
            this.showAlert('Login failed. No response data.');
          }
        },
        (error: any) => {
          console.error('Login error:', error);
          this.showAlert('Login failed. Please check your credentials.');
        }
      );
    } else {
      console.log('Login form is invalid');
      this.showAlert('Please fill out all required fields correctly.');
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response: any) => {
          if (response) {
            console.log('User registered:', response);
            this.showAlert('Registration successful!');
            this.toggleForm();
          } else {
            console.error('Registration failed. No response data.');
            this.showAlert('Registration failed. No response data.');
          }
        },
        (error: any) => {
          console.error('Registration error:', error);
          this.showAlert('Registration failed. Please try again.');
        }
      );
    } else {
      console.log('Registration form is invalid');
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
    this.showOrders = false; // Hide orders section on logout
    this.showAlert('Logged out successfully!');
  }

  toggleOrders(): void {
    this.showOrders = !this.showOrders;
  }

  loadUserOrders(): void {
    if (this.user) {
      const userEmail = encodeURIComponent(this.user.email);
      this.orderService.getUserOrders(userEmail).subscribe(
        (response: any) => {
          console.log('Fetched orders:', response);
          this.orders = response.orders || []; // Ensure orders is an array
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
