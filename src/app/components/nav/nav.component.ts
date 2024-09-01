import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  isMenuOpen = false;
  cartItemCount : number = 0;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    private cartService: CartService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
        this.cdr.markForCheck(); 
      })
    );
    this.subscriptions.add(
      this.authService.isAdmin$.subscribe(status => {
        this.isAdmin = status;
        this.cdr.markForCheck(); 
      })
    );
    this.subscriptions.add(
      this.cartService.getCartItems().subscribe(items => {
        this.cartItemCount = items.length; // Update cart item count
        this.cdr.markForCheck(); 
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
