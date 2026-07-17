import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-verify-otp',
  imports: [FormsModule, RouterLink],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class VerifyOtp implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  email = signal('');
  otp = signal('');
  
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit() {
    // Attempt to pre-fill email from previous step
    const savedEmail = localStorage.getItem('otpEmail');
    if (savedEmail) {
      this.email.set(savedEmail);
    }
  }

  submitVerifyOtp() {
    if (!this.email() || !this.otp()) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const body = {
      email: this.email(),
      otp: this.otp()
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/auth/verify-otp`, body)
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          const token = res?.token || res?.accessToken || res?.data?.token;
          if (token) {
            localStorage.setItem('accessToken', token);
          }
          if (res?.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
          }

          this.successMessage.set('OTP verification successful! Logging you in...');
          
          setTimeout(() => {
            // Redirect based on email role (admin vs customer portal)
            if (this.email().toLowerCase() === 'admin@trafftag.com') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/portal']);
            }
          }, 1500);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const msg = err?.error?.message || err?.error?.Message || err?.error || 'Invalid OTP code. Please check and try again.';
          this.errorMessage.set(typeof msg === 'string' ? msg : 'Invalid OTP code. Please check and try again.');
        }
      });
  }
}
