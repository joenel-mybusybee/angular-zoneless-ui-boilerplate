import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RequestService } from './request.service';
import { LoginRequest } from '../models/request.models';
import { ApiResponse, AuthResponse, TokenResponse } from '../models/models';
import { API_ROUTES } from '../constants/api-routes.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RequestService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  constructor(private http: HttpClient) {
    super();

    this.loggedIn.next(!!this.getItem(this.ACCESS_TOKEN_KEY));
  }

  private loggedIn = new BehaviorSubject<boolean>(false);

  login(credentials: LoginRequest, isRemembered: boolean): Observable<ApiResponse<AuthResponse>> {
    const loginRoute = this.createCompleteRoute(API_ROUTES.auth.login);

    return this.http.post<ApiResponse<AuthResponse>>(loginRoute, credentials).pipe(
      map((response: ApiResponse<AuthResponse>) => {
        if (response['accessToken']) {
          this.setItem(this.ACCESS_TOKEN_KEY, response['accessToken'] || '');
          this.setItem('isRemembered', isRemembered);
          this.loggedIn.next(true);
        }
        return response;
      })
    );
  }

  logout(): void {
    this.loggedIn.next(false);
    localStorage.clear();
  }

  private setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  private getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  public getTokenData(): TokenResponse | null {
    const token = this.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) return null;

    try {
      return jwtDecode<TokenResponse>(token);
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }

  public getToken(): string | null {
    return this.getItem(this.ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return this.getItem(this.REFRESH_TOKEN_KEY);
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    this.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    this.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  public refreshToken(refreshToken: string): Observable<TokenResponse> {
    const refreshRoute = this.createCompleteRoute(API_ROUTES.auth.refreshToken);
    return this.http.post<TokenResponse>(refreshRoute, { refreshToken });
  }

  public isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      // Always check localStorage for accessToken
      observer.next(!!this.getToken());
      observer.complete();
    });
  }
}
