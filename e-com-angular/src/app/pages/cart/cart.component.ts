

import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environment/environment';
import { ToastService } from 'src/app/services/toast.service'; // Assuming a custom toast service for notifications

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  availableItems: any[] = [];
  notAvailableItems: any[] = [];
  totalPrice = 0;
  userId: string = '';
  isLoading = false;
  baseUrl = environment.baseUrl;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodeToken = JSON.parse(atob(token.split('.')[1]));
      this.userId = decodeToken.userId;
      this.fetchCartItems();
    }
  }

  fetchCartItems(): void {
    this.isLoading = true;
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response: any) => {
        const products = response?.cart?.products || [];

        // Split cart into available and not available items
        this.availableItems = products.filter((item: any) => item.product.stock > 0);
        this.notAvailableItems = products.filter((item: any) => item.product.stock === 0);

        this.calculateTotalPrice();
        this.cartService.updateCartQuantity(this.calculateTotalQuantity());
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
        this.toastService.showError('Error fetching cart details.');
        this.isLoading = false;
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.availableItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  calculateTotalQuantity(): number {
    return this.availableItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  updateQuantity(productId: string, action: 'increase' | 'decrease'): void {
    this.http.put(`${this.baseUrl}/api/cart/updateCartQuantity`, {
      userId: this.userId,
      productId,
      action,
    }).subscribe({
      next: () => {
        this.fetchCartItems(); // Refresh cart after updating quantity
      },
      error: (error) => {
        console.error('Error updating cart quantity:', error);
        this.toastService.showError('Error updating cart quantity.');
      }
    });
  }

  removeProduct(productId: string): void {
    this.http.delete(`${this.baseUrl}/api/cart/removeFromCart`, {
      body: { userId: this.userId, productId }
    }).subscribe({
      next: () => {
        this.fetchCartItems(); // Refresh cart after removing item
      },
      error: (error) => {
        console.error('Error removing product from cart:', error);
        this.toastService.showError('Error removing product from cart.');
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/add-address']);
  }
}




