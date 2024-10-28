
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRole$ = new BehaviorSubject<string>(''); // 'user' or 'admin'
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      this.isAuthenticated$.next(true);
      this.userRole$.next(role);
    }
  }

  // HTTP requests for user registration and login
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/user/register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/user/login`, data);
  }

  // Local login logic after successful authentication
  setLogin(token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.isAuthenticated$.next(true);
    this.userRole$.next(role);
  }

  logoutUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isAuthenticated$.next(false);
    this.userRole$.next('');
  }

  isUser(): boolean {
    return this.userRole$.getValue() === 'user';
  }

  isAdmin(): boolean {
    return this.userRole$.getValue() === 'admin';
  }

  isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

  getUserRole(): string {
    return this.userRole$.getValue();
  }

  // Observables for authentication status and user role
  get isAuth(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  get userRole(): Observable<string> {
    return this.userRole$.asObservable();
  }
}




