import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NavComponent } from './nav.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn$', 'isAdmin$']);
    mockCartService = jasmine.createSpyObj('CartService', ['getCartItems']);

    mockAuthService.isLoggedIn$ = of(true);
    mockAuthService.isAdmin$ = of(true);
    mockCartService.getCartItems.and.returnValue(of([{ _id: '1' }, { _id: '2' }]));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        NavComponent
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartService, useValue: mockCartService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu open/close state', () => {
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();

    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should close the menu', () => {
    component.isMenuOpen = true; 
    component.closeMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should update cart item count', () => {
    component.ngOnInit(); 
    fixture.detectChanges(); // Detect changes to update the view

    expect(component.cartItemCount).toBe(2); 
  });

  it('should update authentication status', () => {
    component.ngOnInit(); 
    fixture.detectChanges(); // Detect changes to update the view

    expect(component.isLoggedIn).toBeTrue();
    expect(component.isAdmin).toBeTrue();
  });
});
