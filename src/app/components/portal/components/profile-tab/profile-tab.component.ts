import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-tab.component.html',
  styleUrl: './profile-tab.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProfileTabComponent {
  @Input() firstName = '';
  @Input() lastName = '';
  @Input() userName = '';
  @Input() userEmail = '';
  @Input() phoneNumber = '';
  @Input() userRole = '';
  @Input() membershipType = '';
  @Input() isEditingProfile = false;
  @Input() activeTagsCount = 0;
  
  @Input() editFirstName = '';
  @Input() editLastName = '';
  @Input() editPhoneNumber = '';
  @Input() editCountryCode = '';
  
  @Input() otpResendLoading = false;
  @Input() otpResendSuccess = false;
  
  @Input() currentPassword = '';
  @Input() newPassword = '';
  @Input() isUpdatingPassword = false;
  @Input() passwordUpdateMessage = '';
  @Input() passwordUpdateError = '';

  @Output() editFirstNameChange = new EventEmitter<string>();
  @Output() editLastNameChange = new EventEmitter<string>();
  @Output() editPhoneNumberChange = new EventEmitter<string>();
  @Output() editCountryCodeChange = new EventEmitter<string>();
  
  @Output() currentPasswordChange = new EventEmitter<string>();
  @Output() newPasswordChange = new EventEmitter<string>();

  @Output() startEditingProfile = new EventEmitter<void>();
  @Output() cancelEditingProfile = new EventEmitter<void>();
  @Output() saveProfile = new EventEmitter<void>();
  @Output() resendOtp = new EventEmitter<void>();
  @Output() updatePassword = new EventEmitter<void>();
  @Output() redirectToBillingPortal = new EventEmitter<void>();
}
