import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { RegisterRequest } from '../models/auth';
import { AuthResponse } from '../models/auth';
import { LoginRequest } from '../models/auth';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  
  private baseUrl = 'http://localhost:8080/api/auth';
 
  constructor(
    private http:   HttpClient,
    private router: Router
  ) {}
 
  // ── Login 
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => this.storeTokens(response))
    );
  }
 
  // ── Register 
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
      tap(response => this.storeTokens(response))
    );
  }
 
  // ── Refresh token 
  refresh(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
      tap(response => this.storeTokens(response))
    );
  }
 
  // ── Logout 
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('subscriberId');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
 
  // ── Helpers 
  private storeTokens(response: AuthResponse): void {
    localStorage.setItem('accessToken',  response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userId',       response.userId.toString());
    localStorage.setItem('email',        response.email);
    localStorage.setItem('role',         response.role);
    if (response.subscriberId) {
      localStorage.setItem('subscriberId', response.subscriberId.toString());
    }
  }
 
  getAccessToken():  string | null { return localStorage.getItem('accessToken'); }
  getRefreshToken(): string | null { return localStorage.getItem('refreshToken'); }
  getRole():         string | null { return localStorage.getItem('role'); }
  getUserId():       string | null { return localStorage.getItem('userId'); }
  getSubscriberId(): string | null { return localStorage.getItem('subscriberId'); }
 
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
 
  isAdmin():      boolean { return this.getRole() === 'ADMIN'; }
  isSubscriber(): boolean { return this.getRole() === 'SUBSCRIBER'; }
}

