import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PbService } from '../services/pb.service';

export const authGuard: CanActivateFn = async () => {
  const pb = inject(PbService);
  const router = inject(Router);

  if (!pb.pb.authStore.isValid) {
    router.navigate(['/login']);
    return false;
  }

  const ok = await pb.refreshAuth();
  if (!ok) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
