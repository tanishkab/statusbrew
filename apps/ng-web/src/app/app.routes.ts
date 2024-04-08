import { Route } from '@angular/router';
import { AppComponent } from './app.component';

export const appRoutes: Route[] = [
  { path: process.env['NX_BASE_HREF'], component: AppComponent }
];
