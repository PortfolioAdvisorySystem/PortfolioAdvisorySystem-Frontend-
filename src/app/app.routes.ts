import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { QuestionnaireComponent } from './questionnaire/questionnaire';
import { Loading } from './loading/loading';
import { ResultComponent } from './result/result';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'questions', component: QuestionnaireComponent },
  { path: 'loading', component: Loading },
  { path: 'result', component: ResultComponent } // ✅ FIXED
];