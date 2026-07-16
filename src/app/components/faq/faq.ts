import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  imports: [RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  activeCategory = signal('all');

  faqsList = signal([
    {
      question: 'How does TRAFFTAG protect my privacy?',
      answer: 'TRAFFTAG acts as a secure middleman. When someone scans your QR code, they are directed to a secure webpage where they can type a message. We relay that message to your registered email or phone number. The scanner never sees your contact info, and you never see theirs.',
      category: 'privacy',
      open: false
    },
    {
      question: 'Do I need an app to scan the code?',
      answer: 'No! Any standard smartphone camera can scan the QR code to open the reporting portal. It takes just a few seconds and works instantly on all mobile browsers.',
      category: 'scans',
      open: false
    },
    {
      question: 'How do I activate a new QR tag?',
      answer: 'Simply log in to your Owner Dashboard, go to the "My Vehicles" tab, click "Register Vehicle", and input your unique sticker serial number to link it.',
      category: 'account',
      open: false
    },
    {
      question: 'Are there any shipping costs for physical stickers?',
      answer: 'Free plans can download and print their QR tags immediately. Premium and Fleet subscription plans include free international shipping of professional-grade matte vinyl tags.',
      category: 'account',
      open: false
    },
    {
      question: 'What if someone spams or abuses the scan system?',
      answer: 'Our security engine automatically throttles scan events from the same IP address, blocking malicious users. You can also temporarily deactivate a vehicle tag in one click.',
      category: 'privacy',
      open: false
    },
    {
      question: 'Can I link multiple phone numbers to a single tag?',
      answer: 'Yes, our Fleet plan supports routing alerts to multiple team members or department leads based on custom rules.',
      category: 'scans',
      open: false
    }
  ]);

  filteredFaqs = computed(() => {
    const cat = this.activeCategory();
    const items = this.faqsList();
    if (cat === 'all') return items;
    return items.filter(item => item.category === cat);
  });

  toggleFaq(faqItem: any) {
    this.faqsList.update(list => 
      list.map(item => {
        if (item.question === faqItem.question) {
          return { ...item, open: !item.open };
        }
        return item;
      })
    );
  }
}
