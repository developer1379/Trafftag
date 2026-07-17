import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private http = inject(HttpClient);

  email = signal('');
  password = signal('');
  showPassword = signal(false);
  
  isSubmitting = signal(false);
  errorMessage = signal('');

  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  submitLogin() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const body = {
      email: this.email(),
      password: this.password()
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/auth/login`, body)
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
          
          localStorage.setItem('otpEmail', this.email());
          this.router.navigate(['/verify-otp']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const msg = err?.error?.message || err?.error?.Message || err?.error || 'Invalid credentials or connection issue.';
          
          if (typeof msg === 'string') {
            const lowerMsg = msg.toLowerCase();
            if (lowerMsg.includes('not verified') || lowerMsg.includes('verify') || lowerMsg.includes('otp')) {
              this.errorMessage.set(msg + ' Redirecting to verification page...');
              localStorage.setItem('otpEmail', this.email());
              setTimeout(() => {
                this.router.navigate(['/verify-otp']);
              }, 2000);
            } else {
              this.errorMessage.set(msg);
            }
          } else {
            this.errorMessage.set('Invalid credentials or connection issue.');
          }
        }
      });
  }
}
