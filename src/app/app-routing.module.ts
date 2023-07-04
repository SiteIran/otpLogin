import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AutoLoginGuard } from './guards/auto-login.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInPageModule),
    canLoad: [AutoLoginGuard] // بررسی اینکه آیا باید صفحه معرفی نمایش داده شود یا به داخل ریدایرکت شود
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
