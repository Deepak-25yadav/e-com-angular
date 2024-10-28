
// src/app/pages/order-history/order-history.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { jwtDecode } from 'jwt-decode';

interface Order {
  _id: string;
  orderDate: string;
  products: Array<{
    _id: string;
    product: {
      _id: string;
      title: string;
      description: string;
      price: number;
      images: string[];
    };
    quantity: number;
  }>;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  error: string | null = null;
  userId: string = '';
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.userId;
      this.fetchOrderHistory();
    }
  }

  fetchOrderHistory(): void {
    this.http.get(`${this.baseUrl}/api/cart/orderHistory/${this.userId}`).subscribe({
      next: (response: any) => {
        this.orders = response.orders || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching order history:', err);
        this.error = 'Failed to fetch order history.';
        this.loading = false;
      }
    });
  }

  calculateTotalPrice(products: any[]): number {
    return products.reduce((total, item) => {
      const price = item?.product?.price || 0;
      const quantity = item?.quantity || 0;
      return total + price * quantity;
    }, 0);
  }

  hasAddress(address: any): boolean {
    return address && Object.keys(address).length > 0;
  }
}


