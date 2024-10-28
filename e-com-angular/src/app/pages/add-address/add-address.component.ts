
// src/app/pages/add-address/add-address.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environment/environment';
import { loadStripe } from '@stripe/stripe-js';
import { ToastService } from 'src/app/services/toast.service';
import {jwtDecode} from 'jwt-decode';

interface CustomJwtPayload {
  userId: string;
  userEmail: string;
}

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {
  address = {
    street: '',
    city: '',
    postalCode: '',
    state: '',
    country: ''
  };
  availableItems: any[] = [];
  notAvailableItems: any[] = [];
  getUserAddress: any[] = [];
  userDeliveryAddress: any = null;
  userId: string = '';
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodeToken: CustomJwtPayload = jwtDecode(token);
      this.userId = decodeToken.userId;
      this.fetchUserCart();
      this.fetchUserAddresses();
    }
  }

  fetchUserCart(): void {
    this.http.get(`${this.baseUrl}/api/cart/getCartItem/${this.userId}`).subscribe({
      next: (response: any) => {
        const products = response.cart.products;
        this.availableItems = products.filter((item: any) => item.product.stock > 0);
        this.notAvailableItems = products.filter((item: any) => item.product.stock === 0);
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
      }
    });
  }

  fetchUserAddresses(): void {
    this.http.post(`${this.baseUrl}/api/user/get-user-addresses`, { userId: this.userId }).subscribe({
      next: (response: any) => {
        this.getUserAddress = response.addresses;
      },
      error: (error) => {
        console.error('Error fetching addresses:', error);
      }
    });
  }

  handleAddressSelect(address: any): void {
    this.userDeliveryAddress = address;
  }

  handleSubmit(): void {
    this.http.post(`${this.baseUrl}/api/user/add-address`, {
      userId: this.userId,
      address: this.address
    }).subscribe({
      next: () => {
        this.toastService.showSuccess('Address added successfully');
        this.fetchUserAddresses();
        this.address = { street: '', city: '', postalCode: '', state: '', country: '' };
      },
      error: (error) => {
        console.error('Error adding address:', error);
      }
    });
  }

  handleDeleteAddress(index: number): void {
    this.http.post(`${this.baseUrl}/api/user/delete-user-address`, {
      userId: this.userId,
      index
    }).subscribe({
      next: (response: any) => {
        const updatedAddresses = response.addresses;
        this.getUserAddress = updatedAddresses;
        this.toastService.showSuccess('Address deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting address:', error);
        this.toastService.showError('Error deleting address');
      }
    });
  }

  makePayment(): void {
    loadStripe('pk_test_51Q3XBV06SFttaIhQGO4iDvYeq1aZUD5iydeSE4oKTjNEWqhENI2LhxS5zP6WLrHehvC0ERtrZTc0gx4Yl1Y4nZ0600rwoOIqai').then((stripe) => {
      const token = localStorage.getItem('token');
      const decodedToken: CustomJwtPayload = jwtDecode(token || '');
      const body = {
        products: this.availableItems,
        userEmail: decodedToken.userEmail,
      };
      this.http.post(`${this.baseUrl}/api/payment/create-checkout-session`, body).subscribe({
        next: (session: any) => {
          stripe?.redirectToCheckout({ sessionId: session.id });
        },
        error: (error) => {
          console.error('Error initiating payment:', error);
        }
      });
    });
  }

  handleProceedToPay(): void {
    if (this.userDeliveryAddress) {
      localStorage.setItem('userDeliveryAddress', JSON.stringify(this.userDeliveryAddress));
      this.makePayment();
    } else {
      this.toastService.showError('Please select an address.');
    }
  }
}



