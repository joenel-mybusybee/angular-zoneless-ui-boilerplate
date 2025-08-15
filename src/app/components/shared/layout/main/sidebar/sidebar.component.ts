import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from './../../../../../core/services/navigation.service';
import { NavigationItem } from './../../../../../core/models/ui.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Input() isMobileView = false;
  @Input() isHidden = false;

  navigationItems: NavigationItem[] = [];
  expandedItems: Set<string> = new Set();

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    this.navigationService.navigationItems$.subscribe((items) => {
      this.navigationItems = items;
    });
  }

  toggleSubmenu(path: string, event: Event): void {
    event.preventDefault();
    const submenu = (event.target as HTMLElement).closest('.nav-item')?.querySelector('.submenu-collapse') as HTMLElement;

    if (!submenu) return;

    if (this.expandedItems.has(path)) {
      // Collapse
      submenu.style.height = submenu.scrollHeight + 'px';
      // Force reflow
      submenu.offsetHeight;
      submenu.style.height = '0';
      this.expandedItems.delete(path);
    } else {
      // Expand
      submenu.style.height = submenu.scrollHeight + 'px';
      this.expandedItems.add(path);
      // Reset height after transition
      submenu.addEventListener(
        'transitionend',
        () => {
          if (this.expandedItems.has(path)) {
            submenu.style.height = 'auto';
          }
        },
        { once: true }
      );
    }
  }

  isExpanded(path: string): boolean {
    return this.expandedItems.has(path);
  }
}
