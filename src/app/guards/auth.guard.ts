import { AuthService } from 'src/app/services/auth.service';

import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, from } from 'rxjs';
import { filter, map, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(): Observable<boolean> {
    // فراخوانی تابع loadToken از AuthService و تبدیل Promise به Observable
    return from(this.authService.loadToken()).pipe(
      // استفاده از switchMap برای انتقال به Observable بعدی
      switchMap(() => this.authService.isAuthenticated),
      // استفاده از map برای تبدیل مقادیر
      map((isAuthenticated) => {
        if (isAuthenticated) {
          console.log('check true', isAuthenticated);
          return true;
        } else {
          console.log('check false', isAuthenticated);
          this.router.navigateByUrl('/sign-in');
          return false;
        }
      })
    );
  }
}
