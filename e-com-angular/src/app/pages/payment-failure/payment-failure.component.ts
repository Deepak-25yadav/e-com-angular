
// src/app/pages/payment-failure/payment-failure.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent {
  constructor(private router: Router) {}

  retryPayment(): void {
    this.router.navigate(['/add-address']);
  }
}



