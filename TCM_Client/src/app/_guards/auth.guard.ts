import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AcountService } from '../_services/account/acount.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AcountService);

  const toast = inject(ToastrService);

  if (authService.currentUser()) {
    return true;
  } else {
    toast.error("You can't access this page");
    return false;
  }
};
