

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.baseUrl;
  private cartQuantity$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getCartItems(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/cart/getCartItem/${userId}`);
  }

  addToCart(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    const decodeToken = JSON.parse(atob(token.split('.')[1]));
    const cartObj = {
      userId: decodeToken.userId,
      productId: product._id,
      quantity: 1,
    };
    return this.http.post(`${this.baseUrl}/api/cart/addToCart`, cartObj);
  }

  updateCartQuantity(quantity: number): void {
    this.cartQuantity$.next(quantity);
  }

  get cartQuantity(): Observable<number> {
    return this.cartQuantity$.asObservable();
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/cart/clearCart/${userId}`);
  }
  

}





