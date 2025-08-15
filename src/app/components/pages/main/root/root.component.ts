import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from '../../../shared/layout/main/header/header.component';
import { SidebarComponent } from '../../../shared/layout/main/sidebar/sidebar.component';
import { ToastComponent } from '../../../shared/common/toast/toast.component';

@Component({
  selector: 'main-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, ToastComponent],
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class MainRootComponent implements OnInit, OnDestroy {
  protected sidebarOpen: boolean = false;
  protected sidebarCollapsed: boolean = false;
  private resizeListener: () => void;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private titleService: Title
  ) {
    this.resizeListener = () => {
      const isMobileView = this.isMobile();
      this.sidebarOpen = !isMobileView;
      if (!isMobileView) {
        this.sidebarCollapsed = false;
      }
      // Manually trigger change detection
      this.cdr.detectChanges();
    };

    // Set initial state
    this.sidebarOpen = !this.isMobile();
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.resizeListener);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.router.routerState.root;
          let title = 'Angular Zoneless UI Boilerplate';
          while (route.firstChild) {
            route = route.firstChild;
            if (route.snapshot.data && route.snapshot.data['title']) {
              title = route.snapshot.data['title'];
            }
          }
          return title;
        })
      )
      .subscribe((title) => {
        this.titleService.setTitle(title);
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  handleToggleSidebar(): void {
    if (this.isMobile()) {
      this.sidebarOpen = !this.sidebarOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  isMobile(): boolean {
    return window.innerWidth <= 991.98;
  }
}
