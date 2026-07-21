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
  ownerUsername = signal<string>('Vehicle Owner');
  vehicleInfo = signal<string>('');

  categories = signal<any[]>([
    { value: 'Headlights On', label: 'Headlights On', icon: 'fa-solid fa-lightbulb', colorClass: 'cat-amber' },
    { value: 'Window Open', label: 'Window Open', icon: 'fa-solid fa-window-maximize', colorClass: 'cat-blue' },
    { value: 'Flat Tire', label: 'Flat Tire', icon: 'fa-solid fa-circle-notch', colorClass: 'cat-red' },
    { value: 'Parking Issue / Blocking', label: 'Parking Issue / Blocking', icon: 'fa-solid fa-square-parking', colorClass: 'cat-purple' },
    { value: 'Vehicle Damage', label: 'Vehicle Damage', icon: 'fa-solid fa-car-burst', colorClass: 'cat-orange' },
    { value: 'Emergency / Tow Warning', label: 'Emergency / Tow Warning', icon: 'fa-solid fa-truck-pickup', colorClass: 'cat-crimson' },
    { value: 'Other', label: 'Other', icon: 'fa-solid fa-pen-to-square', colorClass: 'cat-slate' }
  ]);

  getCategoryMeta(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes('headlight') || lower.includes('light')) {
      return { icon: 'fa-solid fa-lightbulb', colorClass: 'cat-amber' };
    }
    if (lower.includes('window')) {
      return { icon: 'fa-solid fa-window-maximize', colorClass: 'cat-blue' };
    }
    if (lower.includes('tire') || lower.includes('flat')) {
      return { icon: 'fa-solid fa-circle-notch', colorClass: 'cat-red' };
    }
    if (lower.includes('parking') || lower.includes('block') || lower.includes('obstruction') || lower.includes('blocking')) {
      return { icon: 'fa-solid fa-square-parking', colorClass: 'cat-purple' };
    }
    if (lower.includes('damage') || lower.includes('burst') || lower.includes('scratch') || lower.includes('collision')) {
      return { icon: 'fa-solid fa-car-burst', colorClass: 'cat-orange' };
    }
    if (lower.includes('emergency') || lower.includes('tow') || lower.includes('warning')) {
      return { icon: 'fa-solid fa-truck-pickup', colorClass: 'cat-crimson' };
    }
    return { icon: 'fa-solid fa-pen-to-square', colorClass: 'cat-slate' };
  }

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
    this.ownerUsername.set('Protected Owner');

    // Query backend public API to resolve associated vehicle & owner details for the scanned QR tag
    this.http.get<any>(`${API_BASE_URL}/api/v1/notifications/scan/${encodeURIComponent(tagIdStr)}`).subscribe({
      next: (res) => {
        if (res) {
          const make = res.vehicleMake || '';
          const model = res.vehicleModel || '';
          const color = res.vehicleColor || '';
          const plate = res.vehiclePlate || '';
          const nick = res.nickname || '';

          let infoStr = '';
          if (color || make || model) {
            infoStr = `${color} ${make} ${model}`.trim();
          }
          if (plate) {
            infoStr += infoStr ? ` [Plate: ${plate}]` : `Plate: ${plate}`;
          }
          if (nick) {
            infoStr += infoStr ? ` (${nick})` : nick;
          }
          this.vehicleInfo.set(infoStr || 'Registered Vehicle');
          
          if (res.categories && Array.isArray(res.categories)) {
            const mapped = res.categories.map((c: string) => {
              const meta = this.getCategoryMeta(c);
              return {
                value: c,
                label: c,
                icon: meta.icon,
                colorClass: meta.colorClass
              };
            });
            this.categories.set(mapped);
          }
        }
      },
      error: (err) => {
        console.warn('Failed to resolve scan details via public API:', err);
        this.vehicleInfo.set('Registered Vehicle');
      }
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

    const categoryObj = this.categories().find(c => c.value === this.selectedCategory());
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
        if (err?.status === 400 && (
          err?.error?.code === 'NOT001' || 
          err?.error?.errorCode === 'NOT001' ||
          err?.error?.message?.includes('NOT001') || 
          err?.error?.message?.includes('expired') || 
          err?.error?.message?.includes('unavailable')
        )) {
          this.errorMessage.set('The owner of this vehicle is currently unavailable.');
        } else {
          this.errorMessage.set(err?.error?.message || 'An error occurred while sending the alert. Please try again.');
        }
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
