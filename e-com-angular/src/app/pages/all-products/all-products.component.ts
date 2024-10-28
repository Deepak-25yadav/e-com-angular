
// src/app/pages/all-products/all-products.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'environment/environment';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  products: any[] = [];
  error: string = '';
  baseUrl = environment.baseUrl;
  token: string | null = localStorage.getItem('token');

  constructor(private http: HttpClient, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    if (this.token) {
      this.http.get(`${this.baseUrl}/api/admin/getProductsByAdmin`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }).subscribe({
        next: (data: any) => {
          if (Array.isArray(data)) {
            this.products = data;
          } else {
            this.error = 'Invalid response format';
          }
        },
        error: () => {
          this.error = 'Error fetching products';
        }
      });
    }
  }

  deleteProduct(id: string): void {
    if (!this.token) {
      this.error = 'No token available for authorization';
      return;
    }

    this.http.delete(`${this.baseUrl}/api/admin/deleteProduct/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).subscribe({
      next: (data: any) => {
        if (data.message === 'Product deleted successfully') {
          this.products = this.products.filter(product => product._id !== id);
          this.toastService.showSuccess('Product deleted successfully');
        } else {
          this.toastService.showError('Error deleting product');
        }
      },
      error: () => {
        this.toastService.showError('Error deleting product');
      }
    });
  }

  editProduct(id: string): void {
    this.router.navigate([`/edit-product/${id}`]);
  }
}

