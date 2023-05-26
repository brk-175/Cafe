import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';

export const MaterialRoutes: Routes = [
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['admin'],
    },
  },
];
