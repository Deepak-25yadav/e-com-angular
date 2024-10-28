

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';
import { environment } from 'environment/environment';
import {jwtDecode} from 'jwt-decode'; // Make sure to install this library using `npm install jwt-decode`

interface CustomJwtPayload {
  userId: string;
  role: string;
}

interface ProductFormData {
  [key: string]: string; // Add index signature to allow dynamic property access
  title: string;
  description: string;
  price: string;
  images: string;
  stock: string;
  category: string;
  brand: string;
  color: string;
  discount: string;
  size: string;
  gender: string;
}

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
  formData: ProductFormData = {
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
  error = '';
  success = '';
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {}

  handleChange(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.formData[field] = inputElement.value;
  }

  handleSubmit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'No token found, please login.';
      return;
    }

    const decoded: CustomJwtPayload = jwtDecode(token);

    if (decoded.role !== 'admin') {
      this.error = 'Only admins can create products.';
      return;
    }

    this.http.post(`${this.baseUrl}/api/admin/createProduct`, this.formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (response: any) => {
        this.success = 'Product created successfully';
        this.error = '';
        this.router.navigate(['/all-products']); // Redirect to all products page
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.error = err.error?.message || 'An error occurred. Please try again later.';
        this.success = '';
      }
    });
  }
}





