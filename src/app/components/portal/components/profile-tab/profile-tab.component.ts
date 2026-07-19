import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-tab.component.html',
  styleUrl: './profile-tab.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProfileTabComponent {
  @Input() userName = 'Member';
  @Input() userEmail = 'user@example.com';
  @Input() userPhone = '+1 (555) 000-0000';
  @Input() membershipType = 'Free Plan';
  @Input() remainingDays = 0;
  @Input() activeTagsCount = 0;

  @Output() openUpgrade = new EventEmitter<void>();
}
