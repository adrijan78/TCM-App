import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AcountService } from '../_services/account/acount.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageMember = localStorage.getItem('member');
  if(localStorageMember!=null){
    let member =JSON.parse(localStorageMember);
     if (member.token) {
    req = req.clone({
      setHeaders: { 
        Authorization: `Bearer ${member.token}`,
      },
    });
  }
  }

 

  return next(req);
};
