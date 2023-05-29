import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { CategoryComponent } from './category/category.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';

export const MaterialRoutes: Routes = [
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['admin'],
    },
  },
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['admin'],
    },
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRoles: ['admin', 'user'],
    },
  },
];
