import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LOGIN } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return true;
        } else {
          return this.router.createUrlTree(['login'], {
            queryParams: {
              message: LOGIN.loginFirst,
              returnUrl: state.url,
            },
          });
        }
      })
    );
  }
}
