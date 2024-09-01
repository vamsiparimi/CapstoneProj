import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin());
  isAdmin$ = this.isAdminSubject.asObservable();

  // Hardcoded admin credentials
  private adminCredentials = {
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'adminpass', 
  };

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(userData: any): Observable<any> {
    // Simulate an admin check
    if (
      userData.email === this.adminCredentials.email &&
      userData.password === this.adminCredentials.password
    ) {
      const adminData = {
        token: 'admin-token',
        user: { ...userData, role: 'admin' },
      };
      this.setAuthData(adminData);
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(true);
      return of(adminData);
    }
    return this.http.post(`${this.apiUrl}/login`, userData).pipe(
      tap((response: any) => {
        this.setAuthData(response);
        this.isLoggedInSubject.next(true);
        this.isAdminSubject.next(response.user.role === 'admin');
      })
    );
  }

  logout(): Observable<any> {
    this.clearAuthData();
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  setAuthData(data: any): void {
    localStorage.setItem(this.tokenKey, data.token);
    localStorage.setItem(this.userKey, JSON.stringify(data.user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'admin';
  }
}
