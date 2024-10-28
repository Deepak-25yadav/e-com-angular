
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  showPassword = false; // Property to toggle password visibility

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Method to toggle password visibility
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: res.message,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.authService.setLogin(res.token, res.role);
          this.loading = false;

          if (res.role === 'user') {
            this.router.navigate(['/']);
          } else if (res.role === 'admin') {
            this.router.navigate(['/all-products']);
          }
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.error.message || 'Invalid login credentials.',
          timer: 3000,
          timerProgressBar: true,
        });
        this.loading = false;
      },
    });
  }
}


