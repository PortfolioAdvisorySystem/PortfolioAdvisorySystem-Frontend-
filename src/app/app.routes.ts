import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth-guard';
// Investor components
import { DashboardComponent } from './dashboard/dashboard';
import { AllocationsComponent } from './allocations/allocations';
import { LandingComponent } from './landing/landing';
import { QuestionnaireComponent } from './questionnaire/questionnaire';
import { Loading } from './loading/loading';
import { ResultComponent } from './result/result';
import { HomeComponent } from './home/home';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard';
import { LoginComponent } from './login/login';

// Admin components
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout';
import { RegisterComponent } from './register/register';
import { DashboardComponent as AdminDashboard } from './admin/pages/dashboard/dashboard';
import { Rules} from './admin/pages/rules/rules';
import { StocksComponent } from './admin/pages/stocks/stocks';
import { WorkflowComponent } from './admin/pages/workflow/workflow';
import { SubscribersComponent } from './admin/pages/subscribers/subscribers';
 import { StrategiesComponent } from './admin/pages/strategies/strategies';
 import { ReportsComponent } from './admin/pages/reports/reports';
import { AuditLogs } from './admin/pages/audit-logs/audit-logs';

export const routes: Routes = [

  // ===== INVESTOR SIDE =====
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'portfolio', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileDashboardComponent, canActivate: [authGuard] },
  { path: 'allocations', component: AllocationsComponent, canActivate: [authGuard] },
  { path: 'questions', component: QuestionnaireComponent, canActivate: [authGuard] },
  { path: 'loading', component: Loading },
  { path: 'result', component: ResultComponent },

  // ===== ADMIN SIDE =====
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboard, canActivate: [adminGuard] },
      { path: 'rules', component: Rules, canActivate: [adminGuard] },
      { path: 'stocks', component: StocksComponent, canActivate: [adminGuard] },
      { path: 'workflow', component: WorkflowComponent, canActivate: [adminGuard] },
      { path: 'subscribers', component: SubscribersComponent, canActivate: [adminGuard] },
       { path: 'strategies', component: StrategiesComponent, canActivate: [adminGuard] },
       { path: 'reports', component: ReportsComponent, canActivate: [adminGuard] },
      { path: 'audit-logs', component: AuditLogs, canActivate: [adminGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];