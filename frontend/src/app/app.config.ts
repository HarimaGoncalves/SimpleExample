import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

/**
 * App-wide providers. provideHttpClient() makes HttpClient injectable so our
 * services can call the C# API.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
};
