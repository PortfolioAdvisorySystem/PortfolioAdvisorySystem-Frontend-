import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { AllocationsComponent } from './allocations/allocations';
import { LandingComponent } from './landing/landing';
import { QuestionnaireComponent } from './questionnaire/questionnaire';
import { Loading } from './loading/loading';
import { ResultComponent } from './result/result';
import { HomeComponent } from './home/home';

export const routes: Routes = [
   { path: '', component: LandingComponent },  
   { path: 'home', component: HomeComponent },
  { path: 'portfolio', component: DashboardComponent },     // My Portfolio
  { path: 'allocations', component: AllocationsComponent },
  { path: 'questions', component: QuestionnaireComponent },
  { path: 'loading', component: Loading },
  { path: 'result', component: ResultComponent }  // My Allocations
];