import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) {}

  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  faqs = signal([
    {
      question: 'What is TRAFFTAG and how does it protect my vehicle?',
      answer: 'TRAFFTAG is a unified traffic compliance and vehicle identification system. By attaching our tamper-proof QR tag to your vehicle, you can check challan status, pay fines instantly, receive real-time alerts, and easily communicate with traffic officials.',
      open: true
    },
    {
      question: 'How do I check if my vehicle has pending traffic fines?',
      answer: 'Simply click on "Check Status" or "Pay Fine" on our homepage, enter your Vehicle Registration Number or Challan ID, and view instant live results.',
      open: false
    },
    {
      question: 'Are online payment transactions on TRAFFTAG safe?',
      answer: 'Yes, all transactions are protected by bank-grade 256-bit SSL encryption and integrated directly with official payment gateways.',
      open: false
    },
    {
      question: 'Is my personal contact information visible to public scanners?',
      answer: 'No! Your privacy is protected. Public scans only display masked safety emergency options unless authorized by traffic enforcement credentials.',
      open: false
    }
  ]);

  whyFeatures = [
    { label: 'Fast & Secure Payments', icon: 'fa-solid fa-credit-card' },
    { label: 'Real-time Updates', icon: 'fa-solid fa-clock-rotate-left' },
    { label: 'All in One Solution', icon: 'fa-solid fa-layer-group' },
    { label: 'User Friendly Interface', icon: 'fa-solid fa-desktop' },
    { label: 'Secure Transactions', icon: 'fa-solid fa-user-shield' },
    { label: '24/7 Support', icon: 'fa-solid fa-headset' }
  ];

  toggleFaq(index: number) {
    this.faqs.update(list => {
      list[index].open = !list[index].open;
      return [...list];
    });
  }

  billingCycle = signal<'monthly' | 'yearly'>('monthly');

  setBillingCycle(cycle: 'monthly' | 'yearly') {
    this.billingCycle.set(cycle);
  }

  openServiceModal(serviceName: string) {
    if (serviceName === 'Pay Fine' || serviceName === 'Check Status') {
      this.router.navigate(['/scan']);
    } else if (serviceName === 'My Violations') {
      this.router.navigate(['/portal']);
    } else {
      this.router.navigate(['/features']);
    }
  }
}
