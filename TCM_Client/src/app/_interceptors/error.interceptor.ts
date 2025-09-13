import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const toast = inject(ToastrService);
  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.console.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }

                throw modalStateErrors.flat();
              }
            } else {
              toast.error(error.error, error.status);
            }

            break;

          case 401:
            toast.error('Неавторизиран пристап', error.status);
            break;

          case 403:
            toast.error('Немате пристап до оваа страна');
            router.navigate(['/club-details'], { relativeTo: route });
            break;
          case 404:
            toast.error('Записот кој го барате не постои');
            router.navigateByUrl('/not found');
            break;

          case 500:
            toast.error('Настана грешка', error.status);
            break;
          default:
            toast.error('Настана грешка.');
            break;
        }
      }
      throw error;
    })
  );
};
