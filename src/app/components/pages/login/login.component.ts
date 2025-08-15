import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/request.models';
import { LOGIN } from '../../../core/constants/constants';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService],
})
export class LoginComponent {
  protected credentials: LoginRequest = { username: '', password: '' };
  protected isRemembered: boolean = false;
  protected loading: boolean = false;
  protected error: string | null = null;
  protected infoMessage: string | null = null;
  private returnUrl: string | null = null;

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.infoMessage = params.get('message');
      this.returnUrl = params.get('returnUrl');
      this.cd.detectChanges();
    });
  }

  protected login(): void {
    this.loading = true;
    this.error = null;
    this.authService
      .login(this.credentials, this.isRemembered)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response['accessToken']) {
            if (this.returnUrl) {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigate(['/main/dashboard']);
            }
          } else {
            this.error = LOGIN.loginFailed;
          }
        },
        error: (err) => {
          this.error = err?.error?.message || LOGIN.loginFailed;
          console.error('Login error:', err);
        },
      });
  }
}
