import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs'; // Import 'of' to create observable values

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true); // Simulate that the user is logged in
    const result = guard.canActivate();
    expect(result).toBeTrue(); // The guard should allow activation
  });

  it('should redirect to login if the user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false); // Simulate that the user is not logged in
    const result = guard.canActivate();
    expect(result).toBeFalse(); // The guard should prevent activation
    expect(router.navigate).toHaveBeenCalledWith(['/login']); // Check if the router navigated to the login page
  });
});
