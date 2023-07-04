import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private authService: AuthService, private router: Router) {

    // this.authService.getUserInfo().subscribe(
    //   (userInfo) => {
    //     // پردازش اطلاعات کاربر دریافت شده
    //     console.log(userInfo);
    //   },
    //   (error) => {
    //     // مدیریت خطاها
    //     console.error(error);
    //   }
    // );
    
  }

   async logout() {
    await this.authService.logout().toPromise();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
  
  
  
}
