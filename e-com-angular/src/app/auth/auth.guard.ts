
import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  const requiredRole = route.data['role'];

  if (!isAuthenticated) {
    // Redirect to login if the user is not authenticated
    router.navigate(['/login']);
    return false;
  }

  if (requiredRole && requiredRole !== userRole) {
    // Redirect to home if the user doesn't have the required role
    router.navigate(['/']);
    return false;
  }

  return true; // Allow route activation
};



