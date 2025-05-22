import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { ImportExportComponent } from './pages/import-export/import-export.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { ViewEmployeeComponent } from './pages/view-employee/view-employee.component';
import { BillingDetailsComponent } from './pages/billing-details/billing-details.component';
import { HierarchyTreeComponent } from './pages/hierarchy-tree/hierarchy-tree.component';

export const routes: Routes = [
  // Public route
  { path: 'login', component: LoginComponent },

  // Protected routes with sidebar
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'import-export', component: ImportExportComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'add-employee', component: AddEmployeeComponent },
      { path: 'billing-details', component: BillingDetailsComponent},
      { path: 'hierarchy-tree', component: HierarchyTreeComponent},
      {
        path: 'edit-employee',
        component: EditEmployeeComponent
      },
      {
        path: 'view-employee',
        component: ViewEmployeeComponent
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Wildcard fallback
  { path: '**', redirectTo: 'dashboard' }
];
