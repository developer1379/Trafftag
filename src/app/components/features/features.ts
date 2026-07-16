import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-features',
  imports: [RouterLink],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  featuresList = signal([
    {
      icon: 'fa-solid fa-shield-halved',
      title: '100% Anonymized Middleman System',
      desc: 'Our system masks all personal attributes. Scanner notifications are routed through our secure email relays, keeping your phone number, email, and identity completely hidden from the public.'
    },
    {
      icon: 'fa-solid fa-bolt',
      title: 'Instant Multi-Channel Alerts',
      desc: 'As soon as a scanner triggers the vehicle QR code, our automated message delivery sends high-priority SMS and email notifications to you in milliseconds, ensuring you react instantly.'
    },
    {
      icon: 'fa-solid fa-car-side',
      title: 'Dynamic Fleet Dashboard',
      desc: 'Link and control multiple personal or commercial vehicles under a single user profile. Manage status tags, download QR codes, and customize messaging templates from one centralized view.'
    },
    {
      icon: 'fa-solid fa-chart-line',
      title: 'Comprehensive Log Analytics',
      desc: 'Review exact timestamps, scan locations, and alert history for every vehicle in your fleet. Monitor scan statistics to optimize notification rates and track history logs.'
    },
    {
      icon: 'fa-solid fa-message',
      title: 'Preset Custom Messages',
      desc: 'Customize the templates available to scanners (e.g., "Your car is parked in a towing zone" or "Your headlights are left on") to speed up emergency resolutions.'
    },
    {
      icon: 'fa-solid fa-qrcode',
      title: 'High-Durability Matte QR Stickers',
      desc: 'Every registered vehicle receives a high-quality, water-resistant, matte-laminated adhesive tag designed to endure extreme heat, sun exposure, and windshield wiper movement.'
    }
  ]);
}
