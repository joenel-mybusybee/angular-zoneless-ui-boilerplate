import { HttpStatusCode } from '@angular/common/http';

export interface ApiResponse<T> {
  data?: T;
  errors?: string[];
  success?: boolean;
  statusCode?: HttpStatusCode;
  [key: string]: any;
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  accessToken: string;
  refreshToken?: string;
  iat: number;
  exp: number;
}
