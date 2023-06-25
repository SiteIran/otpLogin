import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  @Input() phone: string | null = '';
  @Output() verifyOtp = new EventEmitter<string>();
  otp: string | null = null;
  config = {
    length: 4,
    allowNumbersOnly: true,
    inputClass: 'otp-input-style'
  }; // تعریف متغیر config

  constructor(
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    ) { }

  showLoader(msg: string) {
    console.log(msg);
  }

  onOtpChange(event: any) {
    if (event) {
      this.otp = event;
      console.log(this.otp);
    }

  }
  

  onVerifyOtp() {
    if (this.otp) {
      this.verifyOtp.emit(this.otp);
    }
  }

  dismissModal() {
    // Implement the logic to dismiss the modal here
    return this.modalCtrl.dismiss('i am back', 'cancel');
  }

  resendOtp() {
    // Implement the logic to resend the OTP here
  }
}
