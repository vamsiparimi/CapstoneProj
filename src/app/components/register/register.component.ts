import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
  // orderHistory: any[] = [];
  // currentOrder: any = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
      // this.orderHistory = this.authService.getOrderHistory();
      // this.currentOrder = this.authService.getCurrentOrder();
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response) {
            console.log('User logged in:', response);
            alert('Login successful!');
            this.authService.setAuthData(response);
            this.isLoggedIn = true;
            this.user = response.user;
            // this.orderHistory = response.orderHistory;
            // this.currentOrder = response.currentOrder;
          } else {
            console.error('Login failed. No response data.');
          }
        },
        (error: any) => {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
        }
      );
    } else {
      console.log('Login form is invalid');
      alert('Please fill out all required fields correctly.');
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response: any) => {
          if (response) {
            console.log('User registered:', response);
            alert('Registration successful!');
            this.toggleForm();
          } else {
            console.error('Registration failed. No response data.');
          }
        },
        (error: any) => {
          console.error('Registration error:', error);
          alert('Registration failed. Please try again.');
        }
      );
    } else {
      console.log('Registration form is invalid');
      alert('Please fill out all required fields correctly.');
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
    // this.orderHistory = [];
    // this.currentOrder = null;
    alert('Logged out successfully!');
  }
  
}
