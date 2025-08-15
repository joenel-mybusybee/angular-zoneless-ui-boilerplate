import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ModalComponent } from '../../../../shared/common/modal/modal.component';
import { ModalActionButton, ModalAlert, ModalConfig } from '../../../../../core/models/ui.models';
import { PostService } from '../../../../../core/services/post.service';
import { ALERT, ALERT_TYPE } from '../../../../../core/constants/constants';
import { ToastService } from '../../../../../core/services/toast.service';

interface StepperRecord {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-modal-examples',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './modal-examples.component.html',
  styleUrl: './modal-examples.component.scss',
})
export class ModalExamplesComponent {
  @ViewChild('smallModal') protected smallModal!: ModalComponent;
  @ViewChild('largeModal') protected largeModal!: ModalComponent;
  @ViewChild('asyncModal') protected asyncModal!: ModalComponent;
  @ViewChild('stepperModal') protected stepperModal!: ModalComponent;
  @ViewChild('customModal') protected customModal!: ModalComponent;
  @ViewChild('formModal') protected formModal!: ModalComponent;
  @ViewChild('asyncFormModal') protected asyncFormModal!: ModalComponent;

  // Modal configurations
  protected formModalConfig!: ModalConfig;
  protected asyncFormModalConfig!: ModalConfig;
  protected asyncModalConfig!: ModalConfig;
  protected stepperModalConfig!: ModalConfig;
  protected smallModalConfig!: ModalConfig;
  protected largeModalConfig!: ModalConfig;
  protected customModalConfig!: ModalConfig;

  // For form modals
  protected form!: FormGroup;
  protected asyncForm!: FormGroup;
  protected submitted: boolean = false;

  // For stepper modal
  protected readonly totalItems: number = 3;
  protected activeItem: number = 1;

  // Custom buttons demo
  protected customButtons: ModalActionButton[] = [
    {
      label: 'Custom 1',
      icon: 'bi-star',
      action: (): void => alert('Custom 1 clicked!'),
      class: 'btn-outline-primary',
    },
    {
      label: 'Custom 2',
      icon: 'bi-heart',
      action: (): void => alert('Custom 2 clicked!'),
      class: 'btn-outline-danger',
    },
  ];

  // Stepper records demo
  protected stepperRecords: StepperRecord[] = [
    { name: 'Alice', age: 28, address: '123 Main St' },
    { name: 'Bob', age: 34, address: '456 Oak Ave' },
    { name: 'Charlie', age: 22, address: '789 Pine Rd' },
  ];

  // Check if field should show error
  protected shouldShowError(fieldName: string): boolean {
    const control: AbstractControl | null = this.form.get(fieldName);
    return control ? control.invalid && (control.touched || control.dirty || this.submitted) : false;
  }

  // Get error message for form fields
  protected getErrorMessage(fieldName: string): string {
    const control: AbstractControl | null = this.form.get(fieldName);
    if (control?.errors) {
      const errors: ValidationErrors = control.errors;
      if (errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      if (errors['email']) return 'Email must be valid';
      if (errors['minlength'])
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${errors['minlength'].requiredLength} characters`;
      if (errors['min']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be greater than 0`;
    }
    return '';
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private postService: PostService
  ) {
    // Initialize forms
    this.form = this.fb.group({
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.asyncForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Initialize modal configs
    this.formModalConfig = {
      title: 'Form Modal',
      saveLabel: 'Save',
      closeLabel: 'Cancel',
      form: this.form,
    };

    this.asyncFormModalConfig = {
      title: 'Create New Post',
      saveLabel: 'Submit',
      closeLabel: 'Cancel',
      form: this.asyncForm,
      onSave: () => this.handleAsyncFormSubmit(),
      onSaveSuccess: (alert) => this.onAsyncFormSaveSuccess(alert),
      closeOnSave: true,
    };

    this.asyncModalConfig = {
      title: 'Async Save Modal',
      saveLabel: 'Save',
      closeLabel: 'Cancel',
      customActionButtons: [],
      onSave: async () => {
        await new Promise((res) => setTimeout(res, 1500));
        return {
          title: 'Success',
          message: 'Operation completed successfully',
          type: ALERT_TYPE.SUCCESS,
        };
      },
      onSaveSuccess: (alert: ModalAlert) => {
        this.toastService.show(alert);
      },
    };

    this.stepperModalConfig = {
      title: 'Stepper Modal',
      closeLabel: 'Close',
      totalItems: this.totalItems,
      activeItem: this.activeItem,
      size: 'lg',
      onPrev: () => this.prevItem(),
      onNext: () => this.nextItem(),
    };

    this.smallModalConfig = {
      title: 'Small Modal',
      size: 'sm',
      closeLabel: 'Close',
    };

    this.largeModalConfig = {
      title: 'Large Modal',
      size: 'lg',
      closeLabel: 'Close',
      customActionButtons: [],
    };

    this.customModalConfig = {
      title: 'Custom Buttons Modal',
      customActionButtons: this.customButtons,
    };
  }

  // Modal openers
  protected openSmall(): void {
    this.smallModal.open();
  }

  protected openLarge(): void {
    this.largeModal.open();
  }

  protected openAsync(): void {
    this.asyncModal.open();
  }

  protected openStepper(): void {
    this.stepperModal.open();
  }

  protected openCustom(): void {
    this.customModal.open();
  }

  protected openFormModal(): void {
    this.form.reset();
    this.submitted = false;
    this.cdr.detectChanges();
    this.formModal.open();
  }

  protected openAsyncFormModal(): void {
    this.asyncForm.reset();
    this.submitted = false;
    this.cdr.detectChanges();
    this.asyncFormModal.open();
  }

  // Modal closers
  protected closeAsync(): void {
    // Reset state handled by modal component
  }

  protected closeStepper(): void {
    this.stepperModalConfig.activeItem = 1;
    this.activeItem = 1;
  }

  protected closeFormModal(): void {
    this.submitted = false;
  }

  // Async form handlers
  protected handleAsyncFormSubmit(): Promise<ModalAlert> {
    return new Promise<ModalAlert>((resolve) => {
      this.submitted = true;
      this.cdr.detectChanges();

      if (!this.asyncForm?.valid) {
        resolve({
          title: 'Validation Error',
          message: 'Please fill in all required fields correctly',
          type: ALERT_TYPE.ERROR,
        });
        return;
      }

      this.postService
        .add(this.asyncForm.value.title ?? '')
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (_result) => {
            resolve(ALERT.post.addSuccess);
          },
          error: (error: unknown) => {
            resolve({
              ...ALERT.post.addError,
              message: error instanceof Error ? error.message : 'An unexpected error occurred',
            });
          },
        });
    });
  }

  protected onAsyncFormSaveSuccess(alert: ModalAlert): void {
    this.toastService.show(alert);
    this.asyncForm.reset();
    this.submitted = false;
  }

  // Stepper navigation
  protected prevItem(): void {
    if (this.activeItem > 1) {
      this.activeItem--;
      this.stepperModalConfig.activeItem = this.activeItem;
      this.cdr.detectChanges();
    }
  }

  protected nextItem(): void {
    if (this.activeItem < this.totalItems) {
      this.activeItem++;
      this.stepperModalConfig.activeItem = this.activeItem;
      this.cdr.detectChanges();
    }
  }

  // Form modal save
  protected saveFormModal(): void {
    this.submitted = true;
    if (this.form.valid) {
      alert('Form submitted!\n' + JSON.stringify(this.form.value, null, 2));
      this.closeFormModal();
    } else {
      this.cdr.detectChanges();
    }
  }
}
