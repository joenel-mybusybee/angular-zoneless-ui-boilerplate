import { FormGroup } from '@angular/forms';
import { ALERT_TYPE } from '../constants/constants';
import { TemplateRef } from '@angular/core';
import { Route } from '@angular/router';

/* Navigation */
export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  children?: NavigationItem[];
  hideInMenu?: boolean;
  permissions?: string[];
}

export interface NavigationRoute extends Route {
  path: string;
  label: string;
  icon?: string;
  hideInMenu?: boolean;
  permissions?: string[];
  children?: NavigationRoute[];
  [key: string]: any;
}

/* Modal */
export interface ModalActionButton {
  label: string;
  class?: string;
  isDisabled?: boolean;
  isHidden?: boolean;
  icon?: string;
  action: () => void;
}
export interface ModalAlert {
  title: string;
  message: string;
  type: ALERT_TYPE;
}
export interface ModalConfig {
  title: string;
  size?: '' | 'sm' | 'md' | 'lg' | 'xl';
  style?: string;
  saveLabel?: string;
  closeLabel?: string;
  form?: FormGroup;
  onSave?: (formValue?: any) => Promise<ModalAlert>;
  onSaveSuccess?: (alert: ModalAlert) => void;
  onClose?: () => void;
  closeOnSave?: boolean;
  totalItems?: number;
  activeItem?: number;
  onPrev?: (step: number) => void;
  onNext?: (step: number) => void;
  customActionButtons?: ModalActionButton[];
}
export interface Toast extends ModalAlert {
  template?: TemplateRef<any>;
  classname?: string;
  delay?: number;
}
