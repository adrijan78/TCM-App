import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
//import { errorInterceptor } from './_interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideHttpClient(),
    provideToastr({ positionClass: 'toast-bottom-right' }),
    provideAnimations(),
  ],
};
