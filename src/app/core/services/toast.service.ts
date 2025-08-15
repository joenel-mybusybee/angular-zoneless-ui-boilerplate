import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/ui.models';
import { ALERT_TYPE } from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(toast: Toast) {
    toast.classname = `${this.getToastClass(toast.type)} ${toast.classname}`.trim();

    this._toasts.update((toasts) => [...toasts, toast]);
  }

  remove(toast: Toast) {
    this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  clear() {
    this._toasts.set([]);
  }

  private getToastClass(type?: ALERT_TYPE): string {
    switch (type) {
      case ALERT_TYPE.SUCCESS:
        return 'bg-success text-dark';
      case ALERT_TYPE.ERROR:
        return 'bg-danger text-dark';
      case ALERT_TYPE.WARNING:
        return 'bg-warning text-dark';
      case ALERT_TYPE.INFO:
        return 'bg-info text-dark';
      default:
        return 'bg-light';
    }
  }

  public showError(message?: string) {
    this.show({
      title: 'Error',
      message: message || 'There was an error processing your request.',
      type: ALERT_TYPE.ERROR,
    });
  }
}
