

// src/app/pages/edit-product/edit-product.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'environment/environment';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId: string = '';
  formData: any = {
    title: '',
    description: '',
    price: '',
    images: '',
    stock: '',
    category: '',
    brand: '',
    color: '',
    discount: '',
    size: 'M',
    gender: 'male',
  };
  baseUrl = environment.baseUrl;
  token: string | null = localStorage.getItem('token');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    if (this.token) {
      this.http.get(`${this.baseUrl}/api/admin/getProductById/${this.productId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }).subscribe({
        next: (data: any) => {
          this.formData = data;
        },
        error: (error) => {
          this.toastService.showError('Error fetching product details');
        }
      });
    }
  }

  handleInputChange(event: any, field: string): void {
    this.formData[field] = event.target.value;
  }

  submitChanges(): void {
    if (this.token) {
      this.http.put(`${this.baseUrl}/api/admin/updateProduct/${this.productId}`, this.formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      }).subscribe({
        next: () => {
          this.toastService.showSuccess('Product updated successfully');
          this.router.navigate(['/all-products']);
        },
        error: () => {
          this.toastService.showError('Error updating product');
        }
      });
    }
  }
}

