import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  @Input() phone: string | null = '';
  @Output() verifyOtp = new EventEmitter<string>();
  otp: string | null = null;
  config = {
    length: 4,
    allowNumbersOnly: true,
    inputClass: 'otp-input-style'
  }; // تعریف متغیر config
  countdown: number = 120; // زمان شمارش معکوس به ثانیه
  disableVerifyButton: boolean = true;



  constructor(
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    this.countdown = 120; // یا هر مقدار اولیه دلخواهی که می‌خواهید را قرار دهید
    const intervalId = setInterval(() => {
      if (this.countdown === 0) {
        clearInterval(intervalId);
      } else {
        this.countdown--;
      }
    }, 1000);
  }
  

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  showLoader(msg: string) {
    console.log(msg);
  }

  onOtpChange(event: any) {
    if (event) {
      this.otp = event;
      console.log(this.otp);
      
      if (this.otp?.length === this.config.length) {
        this.disableVerifyButton = false;
      } else {
        this.disableVerifyButton = true;
      }
    }
  }
  

  onVerifyOtp() {
    if (this.otp) {
      console.log(this.otp)
      this.verifyOtp.emit(this.otp);
      this.loadingCtrl.create({
        message: 'Verify OTP...'
      }).then(loading => {
        loading.present();
  
        this.authService.login(this.phone ?? '', this.otp ?? '').subscribe(
          () => {
            loading.dismiss();
          //  this.startCountdown(); // شمارش معکوس را از ابتدا شروع کنید
            this.router.navigateByUrl('/home', { replaceUrl: true });
            this.showToast('OTP has been verify successfully.');
          },
          error => {
            loading.dismiss();
            this.showToast('Failed to verify OTP. Please try again.');
          }
        );
      });

    }
  }

  resendOtp() {
    if (this.phone) {
      this.loadingCtrl.create({
        message: 'Resending OTP...'
      }).then(loading => {
        loading.present();
  
        this.authService.sendOTP(this.phone ?? '').subscribe(
          () => {
            loading.dismiss();
            this.startCountdown(); // شمارش معکوس را از ابتدا شروع کنید
            this.showToast('OTP has been resent successfully.');
          },
          error => {
            loading.dismiss();
            this.showToast('Failed to resend OTP. Please try again.');
          }
        );
      });
    }
  }
  
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  
}
