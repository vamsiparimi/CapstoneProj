import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Use HttpClientTestingModule for testing HTTP requests
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Use HttpClientTestingModule for mock HTTP requests
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests remain after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const mockUserData = { email: 'test@test.com', password: '123456' };
    const mockResponse = { message: 'User registered successfully' };

    service.register(mockUserData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login a user and set auth data', () => {
    const mockUserData = { email: 'test@test.com', password: '123456' };
    const mockResponse = {
      token: 'test-token',
      user: { email: 'test@test.com', role: 'user' }
    };

    service.login(mockUserData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(service.isLoggedIn()).toBeTrue();
      expect(service.isAdmin()).toBeFalse();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should retrieve token from localStorage', () => {
    const token = 'test-token';
    localStorage.setItem('authToken', token);
    expect(service.getToken()).toBe(token);
  });

  it('should retrieve user data from localStorage', () => {
    const mockUser = { email: 'test@test.com', role: 'user' };
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    expect(service.getUser()).toEqual(mockUser);
  });

  it('should detect if a user is logged in', () => {
    localStorage.setItem('authToken', 'test-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should detect if a user is an admin', () => {
    const mockAdminUser = { email: 'admin@gmail.com', role: 'admin' };
    localStorage.setItem('authUser', JSON.stringify(mockAdminUser));
    expect(service.isAdmin()).toBeTrue();
  });
});
