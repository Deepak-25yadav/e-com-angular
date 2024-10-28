
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environment/environment';
import { CartService } from 'src/app/services/cart.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  availableItems: any[] = [];
  notAvailableItems: any[] = [];
  checkoutData: any = null;
  loading = false;
  userId: string = '';
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const storedAddress = JSON.parse(localStorage.getItem('userDeliveryAddress') || '{}');

    if (token) {
      const decodeToken = JSON.parse(atob(token.split('.')[1]));
      this.userId = decodeToken.userId;
      this.checkoutData = { userId: this.userId, storedAddress };
      this.fetchUserCart();
    }
  }

  fetchUserCart(): void {
    this.loading = true;
    this.cartService.getCartItems(this.userId).subscribe({
      next: (response: any) => {
        const products = response?.cart?.products || [];
        this.availableItems = products.filter((item: any) => item.product.stock > 0);
        this.notAvailableItems = products.filter((item: any) => item.product.stock === 0);

        if (this.availableItems.length > 0) {
          this.performCheckout();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching cart details:', error);
        this.toastService.showError('Error fetching cart details.');
        this.loading = false;
      }
    });
  }

  performCheckout(): void {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const body = {
      userId: this.userId,
      address: this.checkoutData.storedAddress,
      availableItems: this.availableItems
    };

    this.http.post(`${this.baseUrl}/api/cart/checkout`, body, { headers }).subscribe({
      next: (response: any) => {
        this.toastService.showSuccess('Checkout successful!');
        this.cartService.updateCartQuantity(0); // Reset the cart quantity after checkout
        localStorage.removeItem('userDeliveryAddress');
        console.log('Checkout successful:', response);
      },
      error: (error) => {
        console.error('Error during checkout:', error);
        this.toastService.showError('Error during checkout.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }
}





