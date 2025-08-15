import { Type } from '@angular/core';
import { SelectionType, SortPropDir } from '@swimlane/ngx-datatable';

// Base interface for entities that can have actions
export interface WithActions {
  actions?: never; // This makes the actions property compatible with action columns
}

export type DatatableColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'decimal'
  | 'percentage'
  | 'boolean'
  | 'action'
  | 'checkbox'
  | 'dropdown'
  | 'input';

export type DatatableAction<T = any> = {
  icon: string;
  label: string;
  onClick: (row: T) => void;
  class?: string;
};

export interface FilterConfig {
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  placeholder?: string;
  options?: any[];
  valueKey?: string;
  displayKey?: string;
  multiple?: boolean;
}

export interface FilterEvent<T = any> {
  column: DatatableColumn<T>;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
}

export type DatatableActionColumn<T> = {
  name: string;
  prop: 'actions';
  type: 'action';
  isToggleable?: boolean;
  isHidden?: boolean;
  actions: DatatableColumnAction<T>[];
};

export interface DatatableState {
  pageIndex?: number;
  pageSize?: number;
  filters?: { [key: string]: any };
  sortProp?: { prop: string | number; dir: 'asc' | 'desc' };
  hiddenColumns?: string[];
}

export type DatatableColumn<T> = {
  name: string;
  width?: number;
  prop: keyof T | 'actions';
  type: DatatableColumnType;
  isToggleable?: boolean;
  isHidden?: boolean;
  isDisabled?: boolean;
  isFilterDisabled?: boolean;
  frozen?: 'left' | 'right';
  className?: string;
  sortFn?: (a: T, b: T) => number;
  filterFn?: (value: any, filterValue: any) => boolean;
  /** Display the total of this column in the footer if the type is 'number' or 'decimal'. */
  showTotal?: boolean;
  /** Dropdown configuration for the column if the type is 'dropdown'. */
  dropdownConfig?: {
    options: any[];
    displayKey?: string;
    valueKey?: string;
  };
  inputConfig?: {
    type?: string;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
  };
  /** If the datatable selection is set to 'multiselect' or 'checkbox' and this column is selected, all rows in the table that don't match the selected value will be disabled if the 'isUniqueSelection' flag is set to true. */
  isUniqueSelection?: boolean;
  actions?: DatatableColumnAction<T>[];
  actionsStyle?: 'full-width' | 'default';
  customFormat?: (row: any) => any;
};

export interface DatatableColumnAction<T> {
  /** Display text for the action */
  text?: string;
  /** Icon class (e.g., 'bi bi-pencil') */
  icon?: string;
  /** Button class names */
  class?: string;
  /** Action type - determines rendering style */
  type: 'icon' | 'button' | 'button-icon';
  /** Whether the action is hidden */
  isHidden?: boolean | ((row: T) => boolean);
  /** Whether the action is disabled */
  isDisabled?: boolean | ((row: T) => boolean);
  /** Function to execute when action is clicked */
  onClick: (row: T) => void;
}

export interface DatatableCustomComponent {
  /** Component to render */
  component: Type<any>;
  /** Inputs to pass to the component */
  inputs?: Record<string, any>;
}

export interface DatatableFooterAction {
  text?: string;
  icon?: string;
  class?: string;
  isDisabled?: boolean;
  onClick: (selectedRows: any[]) => void;
}

export interface DatatableConfig<T = any> {
  /** Table title */
  title?: string;
  /** Column definitions */
  columns: DatatableColumn<T>[];
  /** Row data */
  data?: T[];
  /** Selection mode */
  selectionMode?: 'multi' | 'single' | 'none';
  /** Maximum number of selectable rows */
  maxSelection?: number;
  /** Whether to show the search bar */
  showSearch?: boolean;
  /** Whether to enable column filtering */
  enableFiltering?: boolean;
  /** Whether to enable column sorting */
  enableSorting?: boolean;
  /** Footer actions */
  footerActions?: DatatableFooterAction[];
  /** Whether to enable row expansion */
  enableExpansion?: boolean;
  /** Custom row expansion template */
  expansionTemplate?: Type<any>;
  /** Whether to enable virtual scrolling/vertical scrolling */
  virtualScroll?: boolean;
  /** Row height for virtual scrolling */
  rowHeight?: number;
  /** Header height */
  headerHeight?: number;
  /** Footer height */
  footerHeight?: number;
  /** Number of rows per page */
  pageSize?: number;
  /** Whether to hide the footer */
  hideFooter?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** No data message */
  noDataMessage?: string;
  /** Custom sort function */
  sortFn?: (sortProp: SortPropDir, data: T[]) => T[];
  /** Whether to persist column state */
  persistState?: boolean;
  /** State key for persistence */
  stateKey?: string;
  /** Export options */
  export?: {
    enabled: boolean;
    formats?: ('csv' | 'excel' | 'pdf')[];
    fileName?: string;
  };
}

export interface DatatableEvent<T = any> {
  type: 'select' | 'sort' | 'filter' | 'page' | 'export' | 'action';
  data: T | T[];
  meta?: any;
}

export interface DatatableState {
  sortProp?: { prop: string | number; dir: 'asc' | 'desc' };
  filters?: Record<string, any>;
  hiddenColumns?: string[];
  pageSize?: number;
  pageIndex?: number;
}
