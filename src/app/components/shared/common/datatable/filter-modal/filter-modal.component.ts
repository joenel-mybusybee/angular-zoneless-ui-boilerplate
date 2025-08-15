import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatatableColumn } from '../../../../../core/models/datatable.models';
import { ModalComponent } from '../../modal/modal.component';
import { ModalAlert } from '../../../../../core/models/ui.models';
import { ALERT_TYPE } from '../../../../../core/constants/constants';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  template: `
    <app-modal #modal [config]="modalConfig">
      <form [formGroup]="form">
        <div class="mb-3">
          <label class="form-label">Operator</label>
          <select class="form-select form-select-sm" formControlName="operator">
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts With</option>
            <option value="endsWith">Ends With</option>
            @if (config.type === 'number' || config.type === 'decimal' || config.type === 'date') {
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
            }
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Value</label>
          @switch (config.type) {
            @case ('text') {
              <input type="text" class="form-control form-control-sm" formControlName="value" />
            }
            @case ('number') {
              <input type="number" class="form-control form-control-sm" formControlName="value" />
            }
            @case ('decimal') {
              <input type="number" class="form-control form-control-sm" formControlName="value" step="any" />
            }
            @case ('date') {
              <input type="date" class="form-control form-control-sm" formControlName="value" />
            }
            @case ('boolean') {
              <select class="form-select form-select-sm" formControlName="value">
                <option [ngValue]="null">Select...</option>
                <option [ngValue]="true">Yes</option>
                <option [ngValue]="false">No</option>
              </select>
            }
            @case ('select') {
              <select class="form-select form-select-sm" formControlName="value">
                <option [ngValue]="null">Select...</option>
                @for (option of config.options; track option) {
                  <option [ngValue]="option">{{ option }}</option>
                }
              </select>
            }
          }
        </div>
      </form>
    </app-modal>
  `,
})
export class FilterModalComponent {
  @ViewChild('modal') modal!: ModalComponent;

  private resolvePromise!: (value: { value: any; operator: string } | null) => void;

  protected form: FormGroup;
  protected modalConfig = {
    title: '',
    size: 'sm' as const,
    saveLabel: 'Apply',
    closeLabel: 'Clear',
    form: undefined as FormGroup | undefined,
    onSave: async (formValue: any) => {
      this.resolvePromise({ value: formValue.value, operator: formValue.operator });
      return {
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        message: 'Filter applied successfully',
      } as ModalAlert;
    },
    onClose: () => {
      this.resolvePromise(null);
    },
  };

  protected config: {
    type: string;
    options?: any[];
  } = { type: 'text' };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      operator: ['contains'],
      value: [null],
    });
  }

  open(column: DatatableColumn<any>, currentValue: any, currentOperator: string): Promise<{ value: any; operator: string } | null> {
    this.modalConfig = {
      ...this.modalConfig,
      title: `Filter: ${column.name}`,
      form: this.form,
    };

    this.form.patchValue({
      operator: currentOperator,
      value: currentValue,
    });

    this.config = {
      type: this.getFilterType(column),
      options: column.dropdownConfig?.options,
    };

    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      this.modal.open();
    });
  }

  private getFilterType(column: DatatableColumn<any>): string {
    switch (column.type) {
      case 'date':
      case 'datetime':
        return 'date';
      case 'decimal':
      case 'percentage':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'dropdown':
        return 'select';
      default:
        return 'text';
    }
  }
}
