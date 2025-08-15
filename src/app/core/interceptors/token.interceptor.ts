import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenResponse } from '../models/models';
import { Location } from '@angular/common';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private leewayInSeconds: number = 60;

  constructor(
    private authService: AuthService,
    private location: Location
  ) {}

  private decodeToken(): TokenResponse | null {
    return this.authService.getTokenData() || null;
  }

  private logoutAndRedirectToLogin(): void {
    const currentUrl = this.location.path();
    this.authService.logout();

    // Construct the login URL with query parameters
    const loginUrl = new URL('/login', window.location.origin);
    loginUrl.searchParams.set('message', 'Your session has expired. Please log in again.');
    loginUrl.searchParams.set('returnUrl', currentUrl);

    // Redirect with full page refresh
    window.location.href = loginUrl.toString();
  }

  private isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);

    // Validate that token is not from the future
    if (decoded.iat > currentTime) {
      console.warn('Token has a future issue date, considering it invalid');
      return true;
    }

    // Check expiration with leeway
    const willExpireSoon = decoded.exp <= currentTime + this.leewayInSeconds;
    if (willExpireSoon) {
      console.warn('Token will expire soon, considering it invalid.');
      // you may add logic here to show a warning to the user or refresh the token
    }

    return willExpireSoon;
  }

  private isExemptedRoute(request: HttpRequest<unknown>): boolean {
    return request.url.includes('auth/') || request.url.includes('/api/') || request.url.includes('refresh');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    console.log(request.url);
    if (this.isExemptedRoute(request)) {
      return next.handle(request);
    }

    if (token) {
      if (this.isTokenExpired()) {
        // Token is expired, try to refresh
        const refreshToken = this.authService.getRefreshToken();
        if (!refreshToken) {
          this.logoutAndRedirectToLogin();
          return EMPTY;
        }
        return this.authService.refreshToken(refreshToken).pipe(
          switchMap((response: TokenResponse) => {
            this.authService.setTokens(response.accessToken, response.refreshToken!);

            // Clone the request with new token
            const newRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });
            return next.handle(newRequest);
          }),
          catchError((refreshError) => {
            this.logoutAndRedirectToLogin();
            return throwError(() => refreshError);
          })
        );
      }

      // Token is still valid, proceed with the request
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If we get here, token was rejected by the server
          const refreshToken = this.authService.getRefreshToken();

          if (!refreshToken) {
            this.logoutAndRedirectToLogin();
            return EMPTY;
          }

          // Try to refresh the token
          return this.authService.refreshToken(refreshToken).pipe(
            switchMap((response) => {
              this.authService.setTokens(response.accessToken, response.refreshToken!);

              const newRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });
              return next.handle(newRequest);
            }),
            catchError((refreshError) => {
              this.logoutAndRedirectToLogin();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
