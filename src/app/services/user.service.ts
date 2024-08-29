import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getOrderHistory(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/orders/history/${userId}`);
  }

  getCurrentOrder(userId: string): Observable<any> {
    return this.http.get<any>(`/api/orders/current/${userId}`);
  }
}
