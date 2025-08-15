import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private el: ElementRef
  ) {}

  @Output() toggleSidebar = new EventEmitter<void>();

  public onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
