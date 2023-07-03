import { AuthService } from 'src/app/services/auth.service';

import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
 })
 export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
 
  canLoad(): Observable<boolean> {
    this.authService.loadToken(); // فراخوانی متد loadToken() از AuthService
    
    return this.authService.isAuthenticated.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        console.log(isAuthenticated);
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/sign-in');
          return false;
        }
      })
    );
  }
  
  }