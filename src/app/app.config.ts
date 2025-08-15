import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpHandler, HttpHandlerFn, HttpRequest, provideHttpClient } from '@angular/common/http';
import { withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

const tokenInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const handler = {
    handle: next,
  } as HttpHandler;
  return inject(TokenInterceptor).intercept(req, handler);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    TokenInterceptor,
    provideHttpClient(withInterceptors([tokenInterceptorFn])),
  ],
};
