import { Component } from '@angular/core';
import { ModalExamplesComponent } from './modal-examples/modal-examples.component';
import { DatatableExamplesComponent } from './datatable-examples/datatable-examples.component';

@Component({
  selector: 'app-reusable-components',
  standalone: true,
  imports: [ModalExamplesComponent, DatatableExamplesComponent],
  templateUrl: './reusable-components.component.html',
  styleUrl: './reusable-components.component.scss',
})
export class ReusableComponentsComponent {}
