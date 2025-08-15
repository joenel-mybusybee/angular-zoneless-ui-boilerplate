import { NavigationRoute } from '../../../core/models/ui.models';

export const mainRoutes: NavigationRoute[] = [
  {
    path: 'dashboard',
    label: 'Dashboard',
    icon: 'speedometer2',
    data: { title: 'Dashboard' },
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'reusable-components',
    label: 'Reusable Components',
    data: { title: 'Reusable Components' },
    icon: 'box',
    loadComponent: () => import('./reusable-components/reusable-components.component').then((m) => m.ReusableComponentsComponent),
  },
  {
    path: 'sample-nested',
    label: 'Sample Nested Page',
    icon: 'diagram-3',
    children: [
      {
        path: 'nested-page-1',
        label: 'Nested Page 1',
        icon: 'file-earmark-text',
        data: { title: 'Sample Nested Page: Nested Page 1' },
        loadComponent: () => import('./sample-nested/nested-page-1/nested-page-1').then((m) => m.NestedPage1),
      },
      {
        path: 'nested-page-2',
        label: 'Nested Page 2',
        icon: 'file-earmark-text',
        data: { title: 'Sample Nested Page: Nested Page 2' },
        loadComponent: () => import('./sample-nested/nested-page-2/nested-page-2').then((m) => m.NestedPage2),
      },
    ],
  },
];
