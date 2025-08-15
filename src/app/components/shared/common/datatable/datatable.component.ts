import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule, DatatableComponent as NgxDatatableComponent, TableColumn, SelectionType } from '@swimlane/ngx-datatable';
import { DatatableColumn, DatatableConfig, DatatableEvent, DatatableState } from '../../../../core/models/datatable.models';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModalComponent } from './filter-modal/filter-modal.component';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxDatatableModule, NgbDropdownModule, NgbPaginationModule, FilterModalComponent],
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent implements OnInit, OnDestroy {
  @ViewChild('datatable') datatable!: NgxDatatableComponent;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('filterModal') filterModal!: FilterModalComponent;

  private _data: any[] = [];
  private _hasDataInput = false;
  private _loading = false;
  private _columns: TableColumn[] = [];
  private _config: DatatableConfig<any> = {
    columns: [],
    data: [],
    title: '',
    showSearch: false,
    enableFiltering: false,
    selectionMode: 'none',
    export: {
      enabled: false,
      formats: ['csv', 'excel', 'pdf'],
    },
    hideFooter: false,
  };

  protected rows: any[] = [];
  protected temp: any[] = [];
  protected selected: any[] = [];
  protected state: DatatableState = {};
  protected searchTerm = '';
  protected searchSubject = new Subject<string>();
  protected filterModalData: {
    column: DatatableColumn<any>;
    config: { type: string; options?: any[] };
    filterValue: any;
    operator: string;
  } | null = null;
  private destroy$ = new Subject<void>();
  private initialized = false;

  @Input()
  set config(value: DatatableConfig<any>) {
    this._config = value;
    if (this.initialized) {
      if (!this._hasDataInput && value.data) {
        this.updateData(value.data);
      }
      this.cdr.markForCheck();
    }
  }
  get config(): DatatableConfig<any> {
    return this._config;
  }

  @Input()
  set data(value: any[] | undefined) {
    // Mark that we have a direct data input
    this._hasDataInput = value !== undefined;
    // Update internal data
    this._data = value || [];
    if (this.initialized) {
      this.updateData(this._data);
    }
  }
  get data(): any[] {
    return this._data;
  }

  @Input()
  set loading(value: boolean) {
    this._loading = value;
    this.cdr.markForCheck();
  }
  get loading(): boolean {
    return this._loading;
  }

  @Output() events = new EventEmitter<DatatableEvent>();

  constructor(private cdr: ChangeDetectorRef) {
    this.searchSubject.pipe(debounceTime(200), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value) => this.onSearch(value));
  }

  ngOnInit(): void {
    if (!this.config) {
      console.error('Datatable config is required');
      return;
    }

    this.initialized = true;
    this.initializeTable();
    this.loadState();

    this.state.pageSize = this.config.pageSize || 10;
  }

  ngOnDestroy(): void {
    this.saveState();
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected getSelectedInfo(): string {
    if (!this.selected.length) return 'No items selected';
    return `${this.selected.length} ${this.selected.length === 1 ? 'item' : 'items'} selected`;
  }

  public get searchInputId(): string {
    if (!this.config?.title) return 'datatable-search-unknown';
    return 'datatable-search-' + this.config.title.toString().split(' ').join('-').toLowerCase();
  }

  protected get tableColumns(): TableColumn[] {
    return this._columns;
  }

  protected get tableSelectionType(): SelectionType {
    switch (this.config.selectionMode) {
      case 'multi':
        return 'multi' as SelectionType;
      case 'single':
        return 'single' as SelectionType;
      default:
        return 'none' as SelectionType;
    }
  }

  protected columnTrackBy(_: number, column: DatatableColumn<any>): string {
    return String(column.prop);
  }

  protected convertProp(prop: string | number | symbol): string {
    return String(prop);
  }

  protected hasToggleableColumns(): boolean {
    return this.config.columns.some((col) => col.isToggleable);
  }

  protected getDropdownValue(option: any, column: DatatableColumn<any>): any {
    if (!column.dropdownConfig?.valueKey) return option;
    return option?.[column.dropdownConfig.valueKey];
  }

  protected getDropdownDisplay(option: any, column: DatatableColumn<any>): string {
    if (!column.dropdownConfig?.displayKey) return String(option);
    return String(option?.[column.dropdownConfig.displayKey] ?? option);
  }

  protected getExportFormats(): ('csv' | 'excel' | 'pdf')[] {
    return this.config.export?.formats || ['csv', 'excel', 'pdf'];
  }

  protected getExportIcon(format: 'csv' | 'excel' | 'pdf'): string {
    switch (format) {
      case 'csv':
        return 'bi-filetype-csv';
      case 'excel':
        return 'bi-filetype-xlsx';
      case 'pdf':
        return 'bi-filetype-pdf';
      default:
        return 'bi-file';
    }
  }

  protected openFilterModal(event: MouseEvent, column: DatatableColumn<any>): void {
    event.stopPropagation();

    const propKey = String(column.prop);
    const currentFilter = this.state.filters?.[propKey];
    const currentOperator = this.state.filters?.[`${propKey}_operator`] || 'contains';

    this.filterModal.open(column, currentFilter, currentOperator).then((result: { value: any; operator: string } | null) => {
      if (result) {
        this.applyFilter(column, result.value, result.operator);
      } else {
        this.clearFilter(column);
      }
    });
  }

  private clearFilter(column: DatatableColumn<any>): void {
    if (!this.state.filters) return;

    const propKey = String(column.prop);
    delete this.state.filters[propKey];
    delete this.state.filters[`${propKey}_operator`];

    // Reset rows to original data for this column
    this.onFilter(propKey, null, 'contains');
    this.cdr.markForCheck();
  }

  private applyFilter(column: DatatableColumn<any>, value: any, operator: string): void {
    if (!this.state.filters) this.state.filters = {};

    if (value === null || value === undefined || value === '') {
      this.clearFilter(column);
      return;
    }

    const propKey = String(column.prop);
    this.state.filters[propKey] = value;
    this.state.filters[`${propKey}_operator`] = operator;

    this.onFilter(propKey, value, operator);
  }

  protected onFilter(columnProp: string, value: any, operator: string = 'contains'): void {
    this.rows = this.temp.filter((row) => {
      const column = this.config.columns.find((col) => col.prop === columnProp);
      if (!column || column.isFilterDisabled) return true;

      // If filter value is null/undefined/empty, show all rows
      if (value === null || value === undefined || value === '') {
        return true;
      }

      const rowValue = row[columnProp];
      // If row value is null/undefined and we have a filter value, don't show this row
      if (rowValue === null || rowValue === undefined) return false;

      // Use custom filter function if provided
      if (column.filterFn) {
        return column.filterFn(rowValue, value);
      }

      // Default filtering based on operator and column type
      switch (operator) {
        case 'equals':
          return rowValue === value;
        case 'greaterThan':
          return Number(rowValue) > Number(value);
        case 'lessThan':
          return Number(rowValue) < Number(value);
        case 'startsWith':
          return String(rowValue).toLowerCase().startsWith(String(value).toLowerCase());
        case 'endsWith':
          return String(rowValue).toLowerCase().endsWith(String(value).toLowerCase());
        case 'contains':
        default:
          return String(rowValue).toLowerCase().includes(String(value).toLowerCase());
      }
    });

    this.cdr.markForCheck();

    this.events.emit({
      type: 'filter',
      data: this.rows,
      meta: { columnProp, value, operator },
    });
  }

  protected onSearch(value: string): void {
    const val = value.toLowerCase();

    const temp = this.temp.filter((item) => {
      return Object.keys(item).some((key) => {
        const column = this.config.columns.find((col) => col.prop === key);
        if (!column || column.isFilterDisabled) return false;

        const itemValue = item[key];
        if (itemValue == null) return false;

        if (column.filterFn) {
          return column.filterFn(itemValue, val);
        }

        return String(itemValue).toLowerCase().includes(val);
      });
    });

    this.rows = temp;
    this.cdr.markForCheck();

    this.events.emit({
      type: 'filter',
      data: this.rows,
      meta: { searchTerm: value },
    });
  }

  protected onSort(event: { sorts: Array<{ prop: string | number; dir: 'asc' | 'desc' }> }): void {
    const sort = event.sorts[0];
    this.state.sortProp = sort;

    const column = this.config.columns.find((col) => col.prop === sort.prop);

    // Create a new reference and sort
    this.rows = [...this.rows].sort((a, b) => {
      if (column?.sortFn) {
        return sort.dir === 'asc' ? column.sortFn(a, b) : column.sortFn(b, a);
      }

      if (this.config.sortFn) {
        return sort.dir === 'asc' ? (this.config.sortFn(sort, [a, b])[0] === a ? -1 : 1) : this.config.sortFn(sort, [a, b])[0] === a ? 1 : -1;
      }

      const valA = a[sort.prop];
      const valB = b[sort.prop];

      if (column?.type === 'date' || column?.type === 'datetime') {
        return sort.dir === 'asc' ? new Date(valA).getTime() - new Date(valB).getTime() : new Date(valB).getTime() - new Date(valA).getTime();
      }

      return sort.dir === 'asc' ? (valA < valB ? -1 : valA > valB ? 1 : 0) : valA > valB ? -1 : valA < valB ? 1 : 0;
    });

    // Trigger change detection
    this.cdr.detectChanges();

    this.events.emit({
      type: 'sort',
      data: this.rows,
      meta: sort,
    });
  }

  protected onSelect({ selected }: { selected: any[] }): void {
    if (this.config.selectionMode === 'none') return;

    if (this.config.maxSelection && selected.length > this.config.maxSelection) {
      selected = selected.slice(0, this.config.maxSelection);
    }

    this.selected = selected;

    this.events.emit({
      type: 'select',
      data: this.selected,
    });
  }

  protected onPage(event: { offset: number; pageSize: number }): void {
    this.state.pageIndex = event.offset;
    this.state.pageSize = event.pageSize;

    this.events.emit({
      type: 'page',
      data: this.rows,
      meta: event,
    });
  }

  protected onCheckboxChange(event: Event, row: any, column: DatatableColumn<any>): void {
    if (event.target instanceof HTMLInputElement) {
      row[column.prop] = event.target.checked;
    }
  }

  protected toggleColumn(column: DatatableColumn<any>): void {
    column.isHidden = !column.isHidden;

    if (!this.state.hiddenColumns) {
      this.state.hiddenColumns = [];
    }

    const propKey = String(column.prop);
    if (column.isHidden) {
      this.state.hiddenColumns.push(propKey);
    } else {
      this.state.hiddenColumns = this.state.hiddenColumns.filter((col) => col !== propKey);
    }

    // Update the columns
    this.updateColumns();

    // Force table recalculation
    if (this.datatable) {
      Promise.resolve().then(() => {
        this.datatable.recalculate();
        this.cdr.markForCheck();
      });
    }
  }

  protected getTooltip(row: any, column: DatatableColumn<any>): string {
    if (column.type === 'action') return '';
    const value = row[column.prop];
    return value ? String(value) : '';
  }

  protected isActionVisible(action: { isHidden?: boolean | ((row: any) => boolean) }, row: any): boolean {
    if (typeof action.isHidden === 'function') {
      return !action.isHidden(row);
    }
    return !action.isHidden;
  }

  protected isActionDisabled(action: { isDisabled?: boolean | ((row: any) => boolean) }, row: any): boolean {
    if (typeof action.isDisabled === 'function') {
      return action.isDisabled(row);
    }
    return action.isDisabled || false;
  }

  private updateColumns(): void {
    this._columns = this.config.columns
      .filter((col) => !col.isHidden)
      .map((col) => {
        // Preserve all original column properties plus add required ngx-datatable properties
        const colDef: TableColumn & DatatableColumn<any> = {
          ...col,
          prop: String(col.prop),
          name: col.name,
          sortable: this.config.enableSorting !== false,
        };
        return colDef;
      });

    if (this.datatable) {
      this.datatable.columns = [...this._columns];
      Promise.resolve().then(() => {
        this.datatable.recalculate();
        this.cdr.markForCheck();
      });
    } else {
      this.cdr.markForCheck();
    }
  }

  private updateData(data: any[]): void {
    this.rows = Array.isArray(data) ? [...data] : [];
    this.temp = [...this.rows];
    this.cdr.markForCheck();
  }

  private initializeTable(): void {
    if (!this.config) {
      console.error('Datatable config is required');
      return;
    }

    // Initialize columns first
    this.updateColumns();

    // Initialize data based on priority
    const dataToUse = this._hasDataInput ? this._data : this.config.data || [];
    this.updateData(dataToUse);
    this.loading = this.config.loading ?? false;

    // Apply saved state if exists
    if (this.state.sortProp) {
      this.onSort({
        sorts: [
          {
            prop: String(this.state.sortProp.prop),
            dir: this.state.sortProp.dir,
          },
        ],
      });
    }

    if (this.state.filters) {
      Object.entries(this.state.filters).forEach(([key, value]) => {
        if (!key.endsWith('_operator')) {
          const operator = this.state.filters?.[`${key}_operator`] || 'contains';
          this.onFilter(key, value, operator);
        }
      });
    }

    // Reset selection
    this.selected = [];

    // Force change detection
    this.cdr.markForCheck();
  }

  private loadState(): void {
    if (!this.config.persistState || !this.config.stateKey) return;

    const stateKey = 'datatable_' + String(this.config.stateKey);
    const savedState = localStorage.getItem(stateKey);
    if (savedState) {
      this.state = JSON.parse(savedState);
      this.initializeTable();
    }
  }

  private saveState(): void {
    if (!this.config.persistState || !this.config.stateKey) return;
    const stateKey = 'datatable_' + String(this.config.stateKey);
    localStorage.setItem(stateKey, JSON.stringify(this.state));
  }

  protected exportData(format: 'csv' | 'excel' | 'pdf'): void {
    this.events.emit({
      type: 'export',
      data: this.rows,
      meta: { format },
    });
  }
}
