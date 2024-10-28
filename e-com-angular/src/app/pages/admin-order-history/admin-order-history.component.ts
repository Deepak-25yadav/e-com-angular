

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import { environment } from 'environment/environment';
import {jwtDecode} from 'jwt-decode';

interface CustomJwtPayload {
  userId: string;
}

interface Order {
  _id: string;
  orderDate: string;
  products: Product[];
  address?: Address;
  user: User;
}

interface Product {
  productId: string;
  productTitle: string;
  productPrice: number;
  quantity: number;
  productImages: string[];
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

@Component({
  selector: 'app-admin-order-history',
  templateUrl: './admin-order-history.component.html',
  styleUrls: ['./admin-order-history.component.css'],
})
export class AdminOrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  error: string | null = null;
  baseUrl = environment.baseUrl;
  adminId: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: CustomJwtPayload = jwtDecode(token);
      this.adminId = decodedToken.userId;
      this.fetchOrderHistory();
    }
  }

  fetchOrderHistory(): void {
    this.http
      .get<{ message: string; orders: Order[] }>(
        `${this.baseUrl}/api/cart/adminOrderHistory/${this.adminId}`
      )
      .subscribe({
        next: (response) => {
          this.orders = response.orders;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching order history:', error);
          this.error = 'Failed to fetch order history.';
          this.loading = false;
        },
      });
  }

  getTotalPrice(products: Product[]): number {
    return products.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  }
}




