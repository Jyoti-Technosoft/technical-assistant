import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectGuard } from './authorization/redirect-guard/redirect.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout-component.module').then(
        (m) => m.LayoutComponentModule
      ),
  },
  {
    path: 'jyoti-web',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: 'https://www.jyotitechnosoft.com/',
    },
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
