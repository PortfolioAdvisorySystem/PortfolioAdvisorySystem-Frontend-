
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
 
// General auth guard — any logged in user
export const authGuard: CanActivateFn = (route, state) => {
  const auth   = inject(Auth);
  const router = inject(Router);
 
  if (auth.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
 
// Admin only guard
export const adminGuard: CanActivateFn = (route, state) => {
  const auth   = inject(Auth);
  const router = inject(Router);
 
  if (auth.isAdmin()) return true;
  router.navigate(['/unauthorized']);
  return false;
};
 
