import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = await authService.isAdmin();

  if (!isAdmin) {
    return router.createUrlTree(['/admin/login']);
  }

  return true;
};