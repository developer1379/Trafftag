import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private http = inject(HttpClient);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  password = signal('');
  showPassword = signal(false);
  agreeTerms = signal(false);

  isSubmitting = signal(false);
  errorMessage = signal('');

  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  submitRegister() {
    if (!this.firstName() || !this.lastName() || !this.email() || !this.password()) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    if (!this.agreeTerms()) {
      this.errorMessage.set('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Parse phone and country code
    let rawPhone = this.phone().trim();
    let countryCode = '+1';
    let phoneNumber = rawPhone;

    if (rawPhone.startsWith('+')) {
      const match = rawPhone.match(/^\+(\d{1,3})/);
      if (match) {
        countryCode = '+' + match[1];
        phoneNumber = rawPhone.substring(match[0].length).trim();
      }
    } else if (rawPhone.length > 0) {
      countryCode = '+1';
    }

    const body = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password(),
      phoneNumber: phoneNumber || null,
      countryCode: phoneNumber ? countryCode : null
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/auth/register`, body)
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
          const msg = err?.error?.message || err?.error?.Message || err?.error || 'Registration failed. Please check your inputs or network.';
          this.errorMessage.set(typeof msg === 'string' ? msg : 'Registration failed. Please check your inputs or network.');
        }
      });
  }
}
