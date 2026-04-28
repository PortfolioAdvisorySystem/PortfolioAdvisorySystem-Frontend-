import { Routes } from '@angular/router';

// Investor components
import { DashboardComponent } from './dashboard/dashboard';
import { AllocationsComponent } from './allocations/allocations';
import { LandingComponent } from './landing/landing';
import { QuestionnaireComponent } from './questionnaire/questionnaire';
import { Loading } from './loading/loading';
import { ResultComponent } from './result/result';
import { HomeComponent } from './home/home';

// Admin components
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout';
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
  { path: 'home', component: HomeComponent },
  { path: 'portfolio', component: DashboardComponent },
  { path: 'allocations', component: AllocationsComponent },
  { path: 'questions', component: QuestionnaireComponent },
  { path: 'loading', component: Loading },
  { path: 'result', component: ResultComponent },

  // ===== ADMIN SIDE =====
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'rules', component: Rules },
      { path: 'stocks', component: StocksComponent },
      { path: 'workflow', component: WorkflowComponent },
      { path: 'subscribers', component: SubscribersComponent },
       { path: 'strategies', component: StrategiesComponent },
       { path: 'reports', component: ReportsComponent },
      { path: 'audit-logs', component: AuditLogs },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];