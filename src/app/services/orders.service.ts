import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders'; 

  constructor(private http: HttpClient) {}

  saveOrder(orderDetails: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderDetails);
  }

  getUserOrders(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${email}`); // Adjust this URL as needed
  }
}
