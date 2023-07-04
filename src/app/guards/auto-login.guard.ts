import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { filter, map, take, switchMap } from 'rxjs/operators';

@Injectable({
 providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
constructor(private authService: AuthService, private router: Router) {}

 canLoad(): Observable<boolean> {
  // فراخوانی تابع loadToken از AuthService و تبدیل Promise به Observable
  return from(this.authService.loadToken()).pipe(
    // استفاده از switchMap برای انتقال به Observable بعدی
    switchMap(() => this.authService.isAuthenticated),
    // استفاده از map برای تبدیل مقادیر
    map((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
        return false;
      } else {
        return true;
      }
    })
  );
}

}