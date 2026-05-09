 
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
 
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
 
  private isRefreshing  = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);
 
  constructor(
    private authService: Auth,
    private router:      Router
  ) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
    if (req.url.includes('/api/auth/login') ||
        req.url.includes('/api/auth/register') ||
        req.url.includes('/api/auth/refresh')) {
      return next.handle(req);
    }
 
    const tokenReq = this.addToken(req);
 
    return next.handle(tokenReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401(req, next);
        }
        return throwError(() => error);
      })
    );
  }
 
  private addToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getAccessToken();
    if (!token) return req;
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
 
  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(null);
 
      return this.authService.refresh().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          this.refreshSubject.next(response.accessToken);
          return next.handle(this.addToken(req));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    }
 
    // If refresh already in progress — wait for it then retry
    return this.refreshSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(this.addToken(req)))
    );
  }
}
 