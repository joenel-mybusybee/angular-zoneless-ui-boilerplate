import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from './../../../../core/services/toast.service';
import { ALERT_TYPE } from '../../../../core/constants/constants';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet],
  template: `
    @for (toast of toastService.toasts(); track toast) {
      <ngb-toast [class]="toast.classname" [autohide]="autohide" [delay]="toast.delay || defaultDelay" (hidden)="toastService.remove(toast)">
        @if (!toast.template && toast.message) {
          <div class="d-flex align-items-start">
            <div class="toast-icon me-2">
              @switch (toast.type) {
                @case (ALERT_TYPE.SUCCESS) {
                  <i class="bi bi-check-circle-fill text-success"></i>
                }
                @case (ALERT_TYPE.ERROR) {
                  <i class="bi bi-x-circle-fill text-danger"></i>
                }
                @case (ALERT_TYPE.WARNING) {
                  <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                }
                @case (ALERT_TYPE.INFO) {
                  <i class="bi bi-info-circle-fill text-info"></i>
                }
              }
            </div>
            <div class="toast-body flex-grow-1">
              @if (toast.title) {
                <h6 class="mb-1">{{ toast.title }}</h6>
              }
              <small>{{ toast.message }}</small>
            </div>
            <button type="button" class="btn-close ms-2" aria-label="Close" (click)="toastService.remove(toast)"></button>
          </div>
        } @else {
          <ng-template [ngTemplateOutlet]="toast.template"></ng-template>
        }
      </ngb-toast>
    }
  `,
  host: { class: 'toast-container position-fixed top-0 end-0 p-3 pt-5 mt-5', style: 'z-index: 1200' },
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly ALERT_TYPE = ALERT_TYPE;
  protected readonly autohide = true;
  protected readonly defaultDelay = 5000;
}
