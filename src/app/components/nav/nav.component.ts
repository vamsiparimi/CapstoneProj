import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
  private subscriptions: Subscription = new Subscription();

  constructor(public authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
        this.cdr.markForCheck(); // Mark for check to update the view
      })
    );
    this.subscriptions.add(
      this.authService.isAdmin$.subscribe(status => {
        this.isAdmin = status;
        this.cdr.markForCheck(); // Mark for check to update the view
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
