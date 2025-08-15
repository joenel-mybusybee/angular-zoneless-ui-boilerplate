import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NavigationItem, NavigationRoute } from './../models/ui.models';
import { mainRoutes } from './../../components/pages/main/main.routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navigationItems = new BehaviorSubject<NavigationItem[]>([]);
  navigationItems$ = this.navigationItems.asObservable();

  constructor(private router: Router) {
    this.initializeNavigation();
  }

  private initializeNavigation(): void {
    // Convert routes to navigation items
    const items = this.convertRoutesToNavigationItems(mainRoutes);
    this.navigationItems.next(items);
  }

  private convertRoutesToNavigationItems(routes: NavigationRoute[]): NavigationItem[] {
    return routes
      .filter((route) => !route.hideInMenu)
      .map((route) => ({
        path: route.path,
        label: route.label,
        icon: route.icon,
        hideInMenu: route.hideInMenu,
        permissions: route.permissions,
        children: route.children ? this.convertRoutesToNavigationItems(route.children) : undefined,
      }));
  }

  // Optional: Method to check if user has permission to see a navigation item
  hasPermission(permissions?: string[]): boolean {
    if (!permissions || permissions.length === 0) return true;
    // Implement your permission checking logic here
    return true;
  }
}
