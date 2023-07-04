import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = environment.tokenKey;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  /**
   * بررسی وجود توکن در حافظه محلی و تنظیم وضعیت احراز هویت
   */
  public async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) {
      // console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  
  /**
   * ایجاد هدر با توکن
   */
  createAuthHeader(): HttpHeaders {
    const token = this.token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /**
   * ارسال کد OTP به شماره موبایل
   * @param mobile شماره موبایل
   */
  sendOTP(mobile: string): Observable<any> {
    const url = `${this.apiUrl}/authmobile`;
    return this.http.post(url, { mobile });
  }

  /**
   * ورود با شماره موبایل و کد OTP
   * @param mobile شماره موبایل
   * @param otpCode کد OTP
   */
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

  /**
   * دریافت اطلاعات کاربر با استفاده از توکن
   */
  getUserInfo(): Observable<any> {
    const token = this.token;
    if (token) {
      this.isAuthenticated.next(true);
      const url = `${this.apiUrl}/user-info`;
      const headers = this.createAuthHeader();
      return this.http.get(url, { headers });
    } else {
      this.isAuthenticated.next(false);
      console.log('توکن منقضی شده یا معتبر نیست');
      // توکن منقضی شده یا معتبر نیست
      // در اینجا می‌توانید منطق مورد نظر خود را برای مدیریت خطاها اضافه کنید
      return throwError('توکن منقضی شده یا معتبر نیست');
    }
  }

  /**
   * خروج کاربر و حذف توکن
   */
  logout(): Observable<any> {
    const token = this.token;
    const url = `${this.apiUrl}/logout`;
    this.isAuthenticated.next(false);
    Preferences.remove({ key: TOKEN_KEY });
    const headers = this.createAuthHeader();
    return this.http.post(url, null, { headers });
  }
}
