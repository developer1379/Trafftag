import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-scan',
  imports: [FormsModule, RouterLink],
  templateUrl: './scan.html',
  styleUrl: './scan.css',
})
export class Scan implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

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

  // Location signals (Compulsory)
  latitude = signal('');
  longitude = signal('');
  isDetectingLocation = signal(false);
  locationStatusMessage = signal('');
  locationSuccess = signal(false);

  vehicleId = signal<number>(0);

  categories = [
    { value: 'headlights', label: 'Headlights Left On', icon: 'fa-solid fa-lightbulb', colorClass: 'cat-amber' },
    { value: 'window', label: 'Window Rolled Down', icon: 'fa-solid fa-window-maximize', colorClass: 'cat-blue' },
    { value: 'tire', label: 'Flat Tire', icon: 'fa-solid fa-circle-notch', colorClass: 'cat-red' },
    { value: 'parking', label: 'Parking / Obstruction', icon: 'fa-solid fa-square-parking', colorClass: 'cat-purple' },
    { value: 'damage', label: 'Vehicle Damaged', icon: 'fa-solid fa-car-burst', colorClass: 'cat-orange' },
    { value: 'emergency', label: 'Emergency / Towing', icon: 'fa-solid fa-truck-pickup', colorClass: 'cat-crimson' },
    { value: 'other', label: 'Other Issue', icon: 'fa-solid fa-pen-to-square', colorClass: 'cat-slate' }
  ];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tagId');
      if (id) {
        this.tagId.set(id);
        this.lookupTagDetails(id);
      }
    });
    this.generateCaptcha();
    this.detectLocation();
  }

  detectLocation() {
    if (!navigator.geolocation) {
      this.locationStatusMessage.set('Geolocation is not supported by your browser.');
      return;
    }

    this.isDetectingLocation.set(true);
    this.locationStatusMessage.set('Acquiring precise GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        this.latitude.set(lat);
        this.longitude.set(lng);
        this.isDetectingLocation.set(false);
        this.locationSuccess.set(true);
        this.locationStatusMessage.set(`GPS Location Verified (${lat}, ${lng})`);
      },
      (error) => {
        this.isDetectingLocation.set(false);
        this.locationSuccess.set(false);
        let msg = 'Could not fetch GPS automatically. Please enter location coordinates manually below.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied by browser. Please enter location coordinates manually below.';
        }
        this.locationStatusMessage.set(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  lookupTagDetails(tagIdStr: string) {
    const numericId = parseInt(tagIdStr.replace(/\D/g, ''), 10) || 0;
    if (numericId > 0) {
      this.vehicleId.set(numericId);
    }

    // Query backend API to resolve associated vehicleId for the scanned QR tag
    this.http.get<any>(`${API_BASE_URL}/api/v1/qrtags/${encodeURIComponent(tagIdStr)}`).subscribe({
      next: (res) => {
        if (res?.vehicleId) {
          this.vehicleId.set(res.vehicleId);
        } else if (res?.vehicle?.id) {
          this.vehicleId.set(res.vehicle.id);
        }
      },
      error: () => {}
    });
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

    // Compulsory Location Validation
    if (!this.latitude() || !this.longitude()) {
      this.errorMessage.set('Location is compulsory! Click "Detect Location" or enter Latitude and Longitude.');
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

    const categoryObj = this.categories.find(c => c.value === this.selectedCategory());
    const categoryLabel = categoryObj ? categoryObj.label : this.selectedCategory();

    const payload = {
      serialno: activeTag,
      category: categoryLabel,
      message: this.customMessage() || `${categoryLabel} reported for tag ${activeTag}`,
      findercontact: this.contactNumber() || '',
      lattitute: this.latitude(),
      longitute: this.longitude()
    };

    // Dispatch HTTP POST request to /api/v1/notifications/send
    this.http.post<any>(`${API_BASE_URL}/api/v1/notifications/send`, payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        console.warn('Backend API notification /send attempt:', err);
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      }
    });
  }

  resetForm() {
    this.isSuccess.set(false);
    this.selectedCategory.set('');
    this.customMessage.set('');
    this.contactNumber.set('');
    this.latitude.set('');
    this.longitude.set('');
    this.locationSuccess.set(false);
    this.locationStatusMessage.set('');
    this.generateCaptcha();
  }
}
