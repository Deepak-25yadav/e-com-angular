import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userRole = '';

  constructor(private authService: AuthService) {
    this.authService.userRole.subscribe((role) => {
      this.userRole = role;
    });
  }
}

