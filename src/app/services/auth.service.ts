import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 token = '';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.loadToken();
  }

  public async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  

  sendOTP(mobile: string): Observable<any> {
    const url = `${this.apiUrl}/authmobile`;
    return this.http.post(url, { mobile });
  }



  login(mobile: string, otpCode: string): Observable<any> {
    const url = `${this.apiUrl}/verifymobile`;
    return this.http.post(url, { mobile, otpCode }).pipe(
     map((data: any) => data.token),
     switchMap((token) => {
      return from(Preferences.set({ key: TOKEN_KEY, value: token }));
     }),
     tap((_) => {
      this.isAuthenticated.next(true);
     })
    );
   }
  

   getUserInfo(): Observable<any> {
    const token = this.token;
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      // اعتبارسنجی توکن با موفقیت انجام شده است
      this.isAuthenticated.next(true);
      const userId = this.jwtHelper.decodeToken(token).userId;
      const url = `${this.apiUrl}/users/${userId}`;
      return this.http.get(url);
    } else {
      this.isAuthenticated.next(false);
      console.log('توکن منقضی شده یا معتبر نیست');
      // توکن منقضی شده یا معتبر نیست
      // در اینجا می‌توانید منطق مورد نظر خود را برای مدیریت خطاها اضافه کنید
      return throwError('توکن منقضی شده یا معتبر نیست');
    }
  }
  
  

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Preferences.remove({ key: TOKEN_KEY });
  }
}
