import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = {}; // Replace with your user model
  orderHistory: any[] = [];
  currentOrder: any = null;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadOrderHistory();
    this.trackCurrentOrder();
  }

  loadUserProfile() {
    this.user = this.authService.getCurrentUser(); // Assuming authService has a method to get the current user
  }

  loadOrderHistory() {
    this.userService.getOrderHistory(this.user.id).subscribe(
      (history) => this.orderHistory = history,
      (error) => console.error('Error loading order history:', error)
    );
  }

  trackCurrentOrder() {
    this.userService.getCurrentOrder(this.user.id).subscribe(
      (order) => this.currentOrder = order,
      (error) => console.error('Error tracking current order:', error)
    );
  }

  logout() {
    this.authService.logout();
    alert('You have been logged out.');
    // Redirect to login or home page
  }
}
