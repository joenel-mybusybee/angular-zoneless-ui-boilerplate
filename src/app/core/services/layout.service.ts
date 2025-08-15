import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private isSidebarLockedSubject = new BehaviorSubject<boolean>(false);
  private isSidebarCollapsedSubject = new BehaviorSubject<boolean>(true);

  isSidebarLocked$ = this.isSidebarLockedSubject.asObservable();
  isSidebarCollapsed$ = this.isSidebarCollapsedSubject.asObservable();

  toggleSidebarLock(): void {
    this.isSidebarLockedSubject.next(!this.isSidebarLockedSubject.value);
  }

  toggleSidebar(): void {
    if (!this.isSidebarLockedSubject.value) {
      this.isSidebarCollapsedSubject.next(!this.isSidebarCollapsedSubject.value);
    }
  }

  getSidebarLockState(): boolean {
    return this.isSidebarLockedSubject.value;
  }

  getSidebarState(): boolean {
    return this.isSidebarCollapsedSubject.value;
  }
}
