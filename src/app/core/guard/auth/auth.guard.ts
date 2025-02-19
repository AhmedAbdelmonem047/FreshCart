import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let _AuthService = inject(AuthService);
  let _Router = inject(Router);
  if (_AuthService.userData.getValue() == null)
    return true;
  _Router.navigate(['/home']);
  return false;
};
