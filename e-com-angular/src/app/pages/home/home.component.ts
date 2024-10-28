
// src/app/pages/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  searchQuery: string = '';
  selectedCategories: string[] = [];
  priceSort: string = '';
  page: number = 1;
  cartItems: any[] = [];
  isLoading = false;
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCartItems();
  }

  fetchProducts(): void {
    this.isLoading = true;
    const query = {
      category: this.selectedCategories.join(','),
      price: this.priceSort,
      q: this.searchQuery,
      page: this.page.toString(),
    };
    const queryString = new URLSearchParams(query).toString();
    this.http.get(`${this.baseUrl}/api/user/getAllProducts?${queryString}`).subscribe({
      next: (response: any) => {
        this.products = response.products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      },
    });
  }

  fetchCartItems(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodeToken = JSON.parse(atob(token.split('.')[1]));
      this.cartService.getCartItems(decodeToken.userId).subscribe((response: any) => {
        this.cartItems = response.cart.products;
        this.cartService.updateCartQuantity(this.calculateTotalQuantity(this.cartItems));
      });
    }
  }

  calculateTotalQuantity(products: any[]): number {
    return products.reduce((total, item) => total + item.quantity, 0);
  }

  handleAddToCart(product: any): void {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.fetchCartItems(); // Refresh cart items after adding
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
      },
    });
  }

  isProductInCart(productId: string): boolean {
    return this.cartItems.some(item => item.product._id === productId);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  handleSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.fetchProducts();
  }

  handleCategoryChange(event: any): void {
    const { value, checked } = event.target;
    if (checked) {
      this.selectedCategories.push(value);
    } else {
      this.selectedCategories = this.selectedCategories.filter((cat) => cat !== value);
    }
    this.page = 1;
    this.fetchProducts();
  }

  handlePriceSortChange(event: any): void {
    this.priceSort = event.target.value;
    this.page = 1;
    this.fetchProducts();
  }

  handlePageChange(newPage: number): void {
    this.page = newPage;
    this.fetchProducts();
  }
}




