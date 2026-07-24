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

  plansList = signal([
    {
      title: 'Free Shield',
      price: '$0',
      period: 'forever',
      desc: 'Essential privacy shield protection for single vehicle owners.',
      featured: false,
      ctaText: 'Get Started Free',
      features: [
        '1 Registered Vehicle Limit',
        'Email Alerts Delivery',
        'Standard QR Tag Generation',
        'Basic Online Support'
      ]
    },
    {
      title: 'Premium Guard',
      price: '$4.99',
      period: '/month',
      desc: 'Enhanced protection and instant notifications for active drivers.',
      featured: true,
      ctaText: 'Upgrade to Premium',
      features: [
        'Up to 3 Registered Vehicles',
        'Instant SMS & Email Alerts',
        'Custom Scanner Pre-sets',
        'High-Durability Matte Sticker Pack',
        'Priority Customer Support'
      ]
    },
    {
      title: 'Fleet Command',
      price: '$19.99',
      period: '/month',
      desc: 'Complete control and analytics for transport teams and fleets.',
      featured: false,
      ctaText: 'Get Fleet Access',
      features: [
        'Unlimited Registered Vehicles',
        'Unlimited SMS & Custom Webhooks',
        'Consolidated Fleet Dashboard',
        'Bulk QR Sticker Shipping Discount',
        '24/7 Dedicated Support'
      ]
    }
  ]);
}
