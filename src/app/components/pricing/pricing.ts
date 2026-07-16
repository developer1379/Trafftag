import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing',
  imports: [RouterLink],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing {
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  pricingPlans = signal([
    {
      name: 'Free Plan',
      price: '$0',
      period: 'forever',
      desc: 'Essential privacy shield protection for single vehicle owners.',
      features: [
        '1 Registered Vehicle Limit',
        'Email Alerts Delivery',
        'Standard QR Tag Generation',
        'Basic Online Support'
      ],
      action: 'Get Started Free',
      popular: false
    },
    {
      name: 'Premium Plan',
      price: '$4.99',
      period: 'month',
      desc: 'Enhanced protection and instant notifications for active drivers.',
      features: [
        'Up to 3 Registered Vehicles',
        'Instant SMS & Email Alerts',
        'Custom Scanner Pre-sets',
        'High-Durability Matte Sticker Pack',
        'Priority Customer Support'
      ],
      action: 'Upgrade to Premium',
      popular: true
    },
    {
      name: 'Fleet Plan',
      price: '$19.99',
      period: 'month',
      desc: 'Complete control and analytics for transport teams and fleets.',
      features: [
        'Unlimited Registered Vehicles',
        'Unlimited SMS & Custom Webhooks',
        'Consolidated Fleet Dashboard',
        'Bulk QR Sticker Shipping Discount',
        '24/7 Dedicated Support'
      ],
      action: 'Get Fleet Access',
      popular: false
    }
  ]);
}
