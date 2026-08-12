import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponseDto } from '@dtos/order-response.dto';
import { CreateOrderRequestDto } from '@dtos/create-order-request.dto';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/orders';

  getOrders(): Observable<OrderResponseDto[]> {
    return this.http.get<OrderResponseDto[]>(this.apiUrl);
  }

  getOrderById(orderId: string): Observable<OrderResponseDto> {
    const url = `${this.apiUrl}/${orderId}`;
    return this.http.get<OrderResponseDto>(url);
  }

  createOrder(order: CreateOrderRequestDto): Observable<OrderResponseDto> {
    return this.http.post<OrderResponseDto>(this.apiUrl, order);
  }
}
