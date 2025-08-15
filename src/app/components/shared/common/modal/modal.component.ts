import { Component, Input, Output, EventEmitter, DestroyRef, ViewChild, TemplateRef, ContentChild, ChangeDetectorRef } from '@angular/core';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { ModalAlert, ModalConfig } from '../../../../core/models/ui.models';
import { ALERT, ALERT_TYPE } from '../../../../core/constants/constants';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(
    private modalService: NgbModal,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef
  ) {}

  protected readonly ALERT_TYPE = ALERT_TYPE;
  private modalRef?: NgbModalRef;

  private _config: ModalConfig = {
    title: '',
    style: '',
    size: 'md',
    customActionButtons: [],
    closeOnSave: true,
  };

  private _alert?: ModalAlert;

  private _isInSavingState = false;

  @Input() set config(value: ModalConfig) {
    const prevActiveItem = this._config.activeItem;

    this._config = {
      ...this._config,
      ...value,
      customActionButtons: value.customActionButtons ? [...value.customActionButtons] : this._config.customActionButtons,
      activeItem: value.activeItem ?? this._config.activeItem,
      totalItems: value.totalItems ?? this._config.totalItems,
    };

    // Force change detection when stepper state changes
    if (prevActiveItem !== this._config.activeItem) {
      this.cdr.detectChanges();
    }
  }

  get config(): ModalConfig {
    return this._config;
  }

  get isFormInvalid(): boolean {
    return this.form ? this.form.invalid : false;
  }

  get isInSavingState(): boolean {
    return this._isInSavingState;
  }

  private setInSavingState(value: boolean) {
    this._isInSavingState = value;
  }

  get hasFormOrSaveAction(): boolean {
    return !!this.config.form || !!this.config.onSave;
  }

  get form(): FormGroup | undefined {
    return this.config.form;
  }

  get onSave() {
    return this.config.onSave;
  }

  get onSaveSuccess() {
    return this.config.onSaveSuccess;
  }

  get alert(): ModalAlert | undefined {
    return this._alert;
  }

  set alert(value: ModalAlert | undefined) {
    this._alert = value;
    this.cdr.detectChanges();
  }

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  @ViewChild('defaultModalTemplate') defaultModalTemplate!: TemplateRef<any>;
  @ContentChild('modalContent') modalContent?: TemplateRef<any>;

  open() {
    this._alert = undefined;
    this.modalRef = this.modalService.open(this.defaultModalTemplate, {
      animation: true,
      backdrop: this.hasFormOrSaveAction ? 'static' : true, // Prevent closing on outside click if form/save present
      keyboard: !this.hasFormOrSaveAction, // Prevent ESC close if form/save present
      size: this.config.size || undefined,
      centered: this.config.size === '' || this.config.size === 'sm',
      modalDialogClass: this.config.style,
    });

    this.modalRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onClose());

    this.modalRef.dismissed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onClose());
  }

  closeModal() {
    this.modalRef?.close();
  }

  dismissModal() {
    this.modalRef?.dismiss();
  }

  onClose() {
    if (this.config.onClose) {
      this.config.onClose();
    }
    this.close.emit();
  }

  get canNavigatePrev(): boolean {
    return (this.config.activeItem ?? 0) > 1;
  }

  get canNavigateNext(): boolean {
    return (this.config.activeItem ?? 0) < (this.config.totalItems ?? 0);
  }

  prev(): void {
    if (this.canNavigatePrev && this.config.onPrev) {
      this._config = {
        ...this._config,
        activeItem: (this._config.activeItem ?? 0) - 1,
      };
      this.config.onPrev(this._config.activeItem ?? 0);
      this.cdr.detectChanges();
    }
  }

  next(): void {
    if (this.canNavigateNext && this.config.onNext) {
      this._config = {
        ...this._config,
        activeItem: (this._config.activeItem ?? 0) + 1,
      };
      this.config.onNext(this._config.activeItem ?? 0);
      this.cdr.detectChanges();
    }
  }

  async saveAction() {
    if (this.onSave) {
      this.setInSavingState(true);
      try {
        const formValue = this.form?.value;
        this.cdr.detectChanges();
        const alert = await this.onSave(formValue);

        await Promise.resolve().then(() => {
          this.alert = alert;

          if (alert.type === ALERT_TYPE.SUCCESS) {
            if (this.onSaveSuccess) {
              this.onSaveSuccess(alert);
            }
            if (this.config.closeOnSave) {
              this.closeModal();
            }
          }
        });
      } catch (error) {
        await Promise.resolve().then(() => {
          this.alert = {
            ...ALERT.common.error,
            message: error instanceof Error ? error.message : 'An unexpected error occurred',
          };
        });
      } finally {
        this.setInSavingState(false);
        this.cdr.detectChanges();
      }
    }
    this.save.emit();
  }
}
