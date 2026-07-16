import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scan',
  imports: [FormsModule, RouterLink],
  templateUrl: './scan.html',
  styleUrl: './scan.css',
})
export class Scan implements OnInit {
  private route = inject(ActivatedRoute);

  tagId = signal('');
  manualTagInput = signal('');
  selectedCategory = signal('');
  customMessage = signal('');
  contactNumber = signal('');
  
  // CAPTCHA
  num1 = signal(0);
  num2 = signal(0);
  userCaptcha = signal('');
  captchaError = signal(false);

  isSubmitting = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');

  categories = [
    { value: 'headlights', label: 'Headlights Left On', icon: 'fa-solid fa-lightbulb' },
    { value: 'window', label: 'Window Rolled Down', icon: 'fa-solid fa-window-maximize' },
    { value: 'tire', label: 'Flat Tire', icon: 'fa-solid fa-circle-notch' },
    { value: 'parking', label: 'Parking / Obstruction', icon: 'fa-solid fa-square-parking' },
    { value: 'damage', label: 'Vehicle Damaged', icon: 'fa-solid fa-car-burst' },
    { value: 'emergency', label: 'Emergency / Towing', icon: 'fa-solid fa-truck-pickup' },
    { value: 'other', label: 'Other Issue', icon: 'fa-solid fa-pen-to-square' }
  ];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tagId');
      if (id) {
        this.tagId.set(id);
      }
    });
    this.generateCaptcha();
  }

  generateCaptcha() {
    this.num1.set(Math.floor(Math.random() * 9) + 1);
    this.num2.set(Math.floor(Math.random() * 9) + 1);
    this.userCaptcha.set('');
    this.captchaError.set(false);
  }

  submitNotification() {
    const activeTag = this.tagId() || this.manualTagInput();
    
    if (!activeTag) {
      this.errorMessage.set('Please provide a valid QR tag serial number.');
      return;
    }

    if (!this.selectedCategory()) {
      this.errorMessage.set('Please select a notification category.');
      return;
    }

    // Validate CAPTCHA
    const expected = this.num1() + this.num2();
    if (parseInt(this.userCaptcha()) !== expected) {
      this.captchaError.set(true);
      this.errorMessage.set('Incorrect math verification. Try again.');
      this.generateCaptcha();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Simulate routing notification to owner via SMS/Email
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSuccess.set(true);
    }, 1500);
  }

  resetForm() {
    this.isSuccess.set(false);
    this.selectedCategory.set('');
    this.customMessage.set('');
    this.contactNumber.set('');
    this.generateCaptcha();
  }
}
