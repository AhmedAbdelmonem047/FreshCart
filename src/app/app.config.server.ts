import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideLottieServerOptions } from 'ngx-lottie/server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideLottieServerOptions({
      preloadAnimations: {
        folder: 'dist/browser/assets/animations',
        animations: ['data.json'],
      },
    }),
    provideServerRoutesConfig(serverRoutes)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
