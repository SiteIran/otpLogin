import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';

@Injectable()
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

   // Init with null to filter out the first value in a guard!
 isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 token = '';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  sendOTP(mobile: string): Observable<any> {
    const url = `${this.apiUrl}/authmobile`;
    return this.http.post(url, { mobile });
  }

  login(mobile: string, otpCode: string): Observable<any> {
    const url = `${this.apiUrl}/verifymobile`;
    return this.http.post(url, { mobile, otpCode }).pipe(
      map((response: any) => {
        localStorage.setItem('token', response.token);
        return response;
      })
    );
  }

  getUserInfo(): Observable<any> {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      // اعتبارسنجی توکن با موفقیت انجام شده است
      const userId = this.jwtHelper.decodeToken(token).userId;
      const url = `${this.apiUrl}/users/${userId}`;
      return this.http.get(url);
    } else {
      console.log('توکن منقضی شده یا معتبر نیست');
      // توکن منقضی شده یا معتبر نیست
      // در اینجا می‌توانید منطق مورد نظر خود را برای مدیریت خطاها اضافه کنید
      return throwError('توکن منقضی شده یا معتبر نیست');
    }
  }

}
