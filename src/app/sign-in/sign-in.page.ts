import { OtpComponent } from './otp/otp.component';
import { ModalController, ModalOptions } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  form!: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,

  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      phone: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(11), Validators.maxLength(11)]
      }),
    });
  }

  async signIn() {
    try {
      if (!this.form.valid) {
        this.form.markAllAsTouched();
        return;
      }
      console.log(this.form.value);
      console.log('mobile', this.form.get('phone')!.value);
      const mobile = this.form.get('phone')!.value;
      this.authService.sendOTP(mobile).subscribe(
        () => {
          // ارسال موفق
        },
        (error) => {
          // خطا در ارسال
        }
      );

      const options: ModalOptions = {
        component: OtpComponent,
        componentProps: {
          phone: this.form.value.phone
        }
      };
      const modal = await this.modalCtrl.create(options); // اصلاح await
      await modal.present(); // اصلاح await
      const { data } = await modal.onWillDismiss(); // اصلاح await
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }
}
