import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);

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

    // Simulate authentication
    setTimeout(() => {
      this.isSubmitting.set(false);
      
      // Redirect based on email role (admin demo account vs customer portal)
      if (this.email().toLowerCase() === 'admin@trafftag.com') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/portal']);
      }
    }, 1200);
  }
}
