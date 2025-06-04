import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AcountService } from '../_services/account/acount.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AcountService);

  if (accountService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUser()?.token}`,
      },
    });
  }

  return next(req);
};
