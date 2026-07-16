import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);

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

    // Simulate account registration
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/portal']);
    }, 1500);
  }
}
