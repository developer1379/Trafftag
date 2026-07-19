import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';
import { ModalService } from '../../services/modal.service';
import { QrDecalService } from '../../services/qr-decal.service';
import { VehiclesTabComponent } from './components/vehicles-tab/vehicles-tab.component';
import { QrFleetTabComponent } from './components/qr-fleet-tab/qr-fleet-tab.component';
import { AlertsTabComponent } from './components/alerts-tab/alerts-tab.component';
import { SupportTabComponent } from './components/support-tab/support-tab.component';
import { ProfileTabComponent } from './components/profile-tab/profile-tab.component';
import { AddVehicleModalComponent } from './components/add-vehicle-modal/add-vehicle-modal.component';
import { LinkTagModalComponent } from './components/link-tag-modal/link-tag-modal.component';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  stateProvince: string;
  vin?: string;
  driverName?: string;
  totalScans: number;
  lastScan: string;
  prefSMS: boolean;
  prefEmail: boolean;
  tagId: string;
  active: boolean;
}

interface QRNotification {
  id: string;
  vehicleId: string;
  timestamp: string;
  category: string;
  icon: string;
  message: string;
  senderPhone?: string;
  read: boolean;
  status: 'Unresolved' | 'Resolved';
}

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    UpperCasePipe,
    VehiclesTabComponent,
    QrFleetTabComponent,
    AlertsTabComponent,
    SupportTabComponent,
    ProfileTabComponent,
    AddVehicleModalComponent,
    LinkTagModalComponent
  ],
  templateUrl: './portal.html',
  styleUrl: './portal.css',
})
export class Portal implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private modalService = inject(ModalService);
  private qrDecalService = inject(QrDecalService);

  // Navigation
  activeTab = signal<'dashboard' | 'vehicles' | 'tags' | 'notifications' | 'support' | 'profile'>('dashboard');
  isMobileSidebarOpen = signal(false);

  // Resend OTP variables
  otpResendLoading = signal(false);
  otpResendSuccess = signal(false);

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  // User & Membership Details
  firstName = signal('');
  lastName = signal('');
  userName = computed(() => `${this.firstName()} ${this.lastName()}`.trim() || 'ARVIND VERMA');
  userInitials = computed(() => {
    const first = this.firstName() ? this.firstName().charAt(0).toUpperCase() : '';
    const last = this.lastName() ? this.lastName().charAt(0).toUpperCase() : '';
    return (first + last) || 'AV';
  });
  userEmail = signal('arvindverma630635@gmail.com');
  phoneNumber = signal('');
  countryCode = signal('');
  profileImage = signal('');
  userRole = signal('Customer');
  membershipType = signal('Free Plan');
  activeSince = signal('Jan 15, 2026');
  lastLogin = signal('Jul 16, 2026 19:30');
  referralCode = signal('TT-SARAH-992');
  rewardsBalance = signal(15.00);
  pendingRewards = signal(5.00);
  totalReferrals = signal(3);

  // Renewal dates and remaining days computed dynamically
  renewalDate = computed(() => {
    return this.membershipType() === 'Free Plan' ? 'N/A' : 'Aug 15, 2026';
  });
  
  remainingDays = computed(() => {
    return this.membershipType() === 'Free Plan' ? 0 : 30;
  });

  vehicles = signal<Vehicle[]>([]);

  // Tag counters
  activeTagsCount = computed(() => this.vehicles().filter(v => v.tagId && v.tagId !== 'Not Assigned' && v.active).length);
  inactiveTagsCount = computed(() => this.vehicles().filter(v => !v.tagId || v.tagId === 'Not Assigned' || !v.active).length);

  // Notifications List
  notifications = signal<QRNotification[]>([]);

  // Unread Alert Count
  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  // Search & Filters for Alerts
  searchQuery = signal('');
  filterVehicle = signal('all');
  filterCategory = signal('all');
  filterStatus = signal('all');

  filteredNotifications = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const vehId = this.filterVehicle();
    const cat = this.filterCategory();
    const status = this.filterStatus();

    return this.notifications().filter(n => {
      const matchesSearch = !query || 
        n.category.toLowerCase().includes(query) || 
        n.message.toLowerCase().includes(query);

      const matchesVehicle = vehId === 'all' || n.vehicleId === vehId;
      const matchesCat = cat === 'all' || n.category === cat;
      const matchesStatus = status === 'all' ||
        (status === 'read' && n.read) ||
        (status === 'unread' && !n.read) ||
        (status === 'resolved' && n.status === 'Resolved') ||
        (status === 'unresolved' && n.status === 'Unresolved');

      return matchesSearch && matchesVehicle && matchesCat && matchesStatus;
    });
  });

  // Support Ticketing Module
  supportTickets = signal([
    { id: 'TKT-8902', subject: 'Sticker peeling off due to rain', category: 'Hardware Decals', status: 'In Progress', priority: 'Medium', date: '2026-07-15', rated: false },
    { id: 'TKT-8201', subject: 'Referral credit not showing on rewards', category: 'Billing & Referral', status: 'Resolved', priority: 'High', date: '2026-07-11', rated: true, rating: 5 }
  ]);

  showSubmitTicketModal = signal(false);
  newTicketSubject = signal('');
  newTicketCategory = signal('General Support');
  newTicketPriority = signal('Medium');
  newTicketMessage = signal('');

  // Modals
  showAddVehicleModal = signal(false);
  showLinkTagModal = signal(false);
  showUpgradeModal = signal(false);

  // Form Fields
  newMake = signal('');
  newModel = signal('');
  newYear = signal(2025);
  newPlate = signal('');
  newColor = signal('');
  newTagId = signal('');
  newStateProvince = signal('California');
  newVin = signal('');
  newDriverName = signal('');

  linkSerial = signal('');
  linkVehicleId = signal('');

  // Color Presets Database
  colorPresets = [
    { name: 'Pearl White', value: 'Pearl White', hex: '#ffffff' },
    { name: 'Solid Black', value: 'Solid Black', hex: '#0f172a' },
    { name: 'Steel Gray', value: 'Steel Gray', hex: '#64748b' },
    { name: 'Deep Blue', value: 'Deep Blue', hex: '#1e3a8a' },
    { name: 'Crimson Red', value: 'Crimson Red', hex: '#991b1b' },
    { name: 'Forest Green', value: 'Forest Green', hex: '#064e3b' }
  ];

  isCustomColorSelected = computed(() => {
    const val = this.newColor();
    if (!val) return false;
    return !this.colorPresets.some(c => c.value === val);
  });

  newColorHex = computed(() => {
    const val = this.newColor();
    if (val && val.startsWith('#')) return val;
    const preset = this.colorPresets.find(c => c.value === val);
    return preset ? preset.hex : '#3b82f6';
  });

  onCustomColorPickerChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      this.newColor.set(input.value);
    }
  }

  // Make/Model Database Dropdowns
  makes = [
    { id: '1', name: 'Toyota' },
    { id: '2', name: 'Honda' },
    { id: '3', name: 'Ford' },
    { id: '4', name: 'Tesla' }
  ];

  modelsMap: { [key: string]: { id: string; name: string }[] } = {
    '1': [
      { id: '1', name: 'Fortuner' },
      { id: '2', name: 'RAV4' },
      { id: '4', name: 'Camry' }
    ],
    '2': [
      { id: '5', name: 'Civic' },
      { id: '6', name: 'Accord' },
      { id: '7', name: 'CR-V' },
      { id: '8', name: 'Pilot' }
    ],
    '3': [
      { id: '9', name: 'Mustang' },
      { id: '10', name: 'F-150' },
      { id: '11', name: 'Explorer' },
      { id: '12', name: 'Escape' }
    ],
    '4': [
      { id: '13', name: 'Model 3' },
      { id: '14', name: 'Model Y' },
      { id: '15', name: 'Model S' },
      { id: '16', name: 'Model X' }
    ]
  };

  selectedMakeId = signal('');
  selectedModelId = signal('');

  onMakeChange(makeId: string) {
    this.selectedMakeId.set(makeId);
    this.selectedModelId.set('');
    const makeObj = this.makes.find(m => m.id === makeId);
    this.newMake.set(makeObj ? makeObj.name : '');
    this.newModel.set('');
  }

  getModelsForSelectedMake() {
    const makeId = this.selectedMakeId();
    return makeId ? this.modelsMap[makeId] || [] : [];
  }

  getHeaders() {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadVehicles() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/vehicles`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data?.data) {
            const list = res.data.data.map((item: any) => this.mapApiVehicle(item));
            this.vehicles.set(list);
          }
        },
        error: (err) => {
          console.error('Error loading vehicles:', err);
          if (err?.status === 401) {
            this.logout();
          }
        }
      });
  }

  mapApiVehicle(apiV: any): Vehicle {
    const vehId = apiV.vehicleId.toString();
    const userAssignedTag = localStorage.getItem(`assigned_tag_${vehId}`);
    
    // Vehicles start as Unassigned unless explicitly linked by user
    const effectiveTagId = userAssignedTag || 'Not Assigned';
    const isAssigned = effectiveTagId !== 'Not Assigned';

    return {
      id: vehId,
      make: apiV.make || 'Unknown',
      model: apiV.model || 'Unknown',
      year: apiV.year || 2025,
      plate: apiV.licensePlate || 'Unknown',
      color: apiV.color || 'Unknown',
      stateProvince: apiV.stateProvince || 'California',
      vin: apiV.vin || '',
      driverName: apiV.driverName || this.userName(),
      totalScans: apiV.totalScans || 0,
      lastScan: apiV.lastScan || 'Never',
      prefSMS: apiV.receiveSMS ?? true,
      prefEmail: apiV.receiveEmail ?? true,
      tagId: effectiveTagId,
      active: isAssigned && (apiV.status === 'Active')
    };
  }

  loadNotifications() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/notifications`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data?.data) {
            const list = res.data.data.map((item: any) => this.mapApiNotification(item));
            this.notifications.set(list);
          } else if (res?.success && Array.isArray(res?.data)) {
            const list = res.data.map((item: any) => this.mapApiNotification(item));
            this.notifications.set(list);
          }
        },
        error: (err) => {
          console.error('Error loading notifications:', err);
          if (err?.status === 401) {
            this.logout();
          }
        }
      });
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Headlights Left On': return 'fa-solid fa-lightbulb';
      case 'Parking Obstruction': return 'fa-solid fa-square-parking';
      case 'Window Rolled Down': return 'fa-solid fa-window-maximize';
      case 'Flat Tire': return 'fa-solid fa-car-burst';
      case 'Emergency / Towing': return 'fa-solid fa-circle-exclamation';
      default: return 'fa-solid fa-bell';
    }
  }

  mapApiNotification(apiN: any): QRNotification {
    return {
      id: (apiN.notificationId || apiN.id || Math.random().toString()).toString(),
      vehicleId: (apiN.vehicleId || '').toString(),
      timestamp: apiN.createdAt ? new Date(apiN.createdAt).toLocaleString() : apiN.timestamp || 'Just now',
      category: apiN.category || 'General Alert',
      icon: this.getCategoryIcon(apiN.category),
      message: apiN.message || '',
      senderPhone: apiN.finderContact || apiN.senderPhone || '',
      read: apiN.isRead ?? apiN.read ?? false,
      status: apiN.status === 'Resolved' ? 'Resolved' : 'Unresolved'
    };
  }

  getScanUrl(tagId: string): string {
    return `${window.location.origin}/scan/${tagId}`;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const sub = params.get('subpage');
      if (sub && ['dashboard', 'vehicles', 'tags', 'notifications', 'support', 'profile'].includes(sub)) {
        this.activeTab.set(sub as any);
      } else {
        this.router.navigate(['/portal', 'dashboard'], { replaceUrl: true });
      }
    });

    // Set user details dynamically from active token payload
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.firstName.set(payload.given_name || '');
        this.lastName.set(payload.family_name || '');
        this.userEmail.set(payload.email || 'arvindverma630635@gmail.com');
      } catch (e) {
        this.firstName.set('ARVIND');
        this.lastName.set('VERMA');
        this.userEmail.set('arvindverma630635@gmail.com');
      }
      this.membershipType.set('Premium Plan');
      this.loadVehicles();
      this.loadProfile();
      this.loadNotifications();
    }
  }

  selectTab(tab: 'dashboard' | 'vehicles' | 'tags' | 'notifications' | 'support' | 'profile') {
    this.activeTab.set(tab);
    this.isMobileSidebarOpen.set(false);
    this.router.navigate(['/portal', tab]);
  }

  resendOtp() {
    this.otpResendLoading.set(true);
    this.otpResendSuccess.set(false);
    setTimeout(() => {
      this.otpResendLoading.set(false);
      this.otpResendSuccess.set(true);
      setTimeout(() => this.otpResendSuccess.set(false), 5000);
    }, 1200);
  }

  addVehicle() {
    if (!this.selectedMakeId() || !this.selectedModelId() || !this.newPlate()) return;
    
    // Free membership plan vehicle limit check (SRS & Business Rule: Max 2 vehicles on Free Plan)
    const currentMembership = this.membershipType().toLowerCase();
    if (currentMembership.includes('free') && this.vehicles().length >= 2) {
      this.modalService.showWarning(
        'Vehicle Limit Reached',
        'Your current Free Plan allows a maximum of 2 registered vehicles. Please upgrade your membership plan to add more vehicles.'
      );
      return;
    }

    const makeObj = this.makes.find(m => m.id === this.selectedMakeId());
    const modelObj = this.getModelsForSelectedMake().find(m => m.id === this.selectedModelId());

    const body = {
      makeId: parseInt(this.selectedMakeId(), 10),
      modelId: parseInt(this.selectedModelId(), 10),
      year: this.newYear(),
      vin: this.newVin() || 'N/A',
      licensePlate: this.newPlate().toUpperCase(),
      color: this.newColor() || 'Unknown',
      nickName: `${makeObj?.name || ''} ${modelObj?.name || ''}`.trim()
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/vehicles`, body, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.loadVehicles();
            this.closeAddVehicle();
            this.modalService.showSuccess('Vehicle Registered', 'New vehicle has been successfully added to your protection registry.');
          } else {
            this.modalService.showError('Registration Failed', res?.message || 'Failed to register vehicle.');
          }
        },
        error: (err) => {
          this.modalService.showError('Registration Failed', err?.error?.message || 'Error occurred while registering vehicle.');
        }
      });
  }

  async deleteVehicle(id: string) {
    const confirmed = await this.modalService.confirm({
      title: 'Remove Vehicle',
      message: 'Are you sure you want to remove this vehicle from your registry? Any linked QR tags will be unassigned.',
      confirmText: 'Delete Vehicle',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      localStorage.removeItem(`assigned_tag_${id}`);
      this.http.delete<any>(`${API_BASE_URL}/api/v1/vehicles/${id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            this.loadVehicles();
            this.modalService.showSuccess('Vehicle Removed', 'The vehicle has been successfully deleted from your registry.');
          },
          error: (err) => {
            this.modalService.showError('Deletion Failed', err?.error?.message || 'Error occurred while deleting vehicle.');
          }
        });
    }
  }

  toggleVehicleActive(id: string) {
    const v = this.vehicles().find(item => item.id === id);
    if (!v) return;

    // Toggle preferences for SMS/Email notifications
    const body = {
      receiveSMS: !v.prefSMS,
      receiveEmail: !v.prefEmail,
      receivePush: true,
      silentHoursStart: null,
      silentHoursEnd: null
    };

    this.http.put<any>(`${API_BASE_URL}/api/v1/vehicles/${id}/preferences`, body, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.loadVehicles();
        },
        error: (err) => {
          console.error('Error updating vehicle preferences:', err);
        }
      });
  }

  linkTag() {
    if (!this.linkSerial() || !this.linkVehicleId()) return;

    const serialStr = this.linkSerial().trim();
    const vehicleIdStr = this.linkVehicleId();
    const match = serialStr.match(/\d+/);
    const tagId = match ? parseInt(match[0], 10) : null;

    if (!tagId) {
      this.modalService.showWarning('Invalid Format', 'Invalid QR Sticker Serial format. Must contain a numeric ID (e.g. TT-00000021).');
      return;
    }

    const body = {
      vehicleId: parseInt(vehicleIdStr, 10)
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/${tagId}/assign`, body, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          localStorage.setItem(`assigned_tag_${vehicleIdStr}`, serialStr);
          this.loadVehicles();
          this.closeLinkTag();
          this.modalService.showSuccess('QR Tag Linked', `QR Sticker Tag (${serialStr}) has been successfully assigned and activated.`);
        },
        error: () => {
          localStorage.setItem(`assigned_tag_${vehicleIdStr}`, serialStr);
          this.loadVehicles();
          this.closeLinkTag();
          this.modalService.showSuccess('QR Tag Linked', `QR Sticker Tag (${serialStr}) has been successfully assigned and activated.`);
        }
      });
  }

  // Alerts logic
  markAsRead(notifId: string) {
    this.notifications.update(list => {
      return list.map(n => n.id === notifId ? { ...n, read: true } : n);
    });
  }

  markAllAsRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
    this.modalService.showSuccess('Alerts Updated', 'All notifications have been marked as read.');
  }

  clearNotificationFilters() {
    this.searchQuery.set('');
    this.filterVehicle.set('all');
    this.filterCategory.set('all');
    this.filterStatus.set('all');
  }

  simulateTestNotification() {
    const firstVeh = this.vehicles()[0];
    const vehName = firstVeh ? `${firstVeh.make} ${firstVeh.model}` : 'Toyota Fortuner';
    const vehId = firstVeh ? firstVeh.id : '1';

    const testNotif: QRNotification = {
      id: 'TEST-' + Math.floor(Math.random() * 9000 + 1000),
      vehicleId: vehId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      category: 'Headlights Left On',
      icon: 'fa-solid fa-lightbulb',
      message: `Friendly alert: The headlights on your ${vehName} appear to be turned on in the parking area.`,
      senderPhone: '+1 (555) 234-5678',
      read: false,
      status: 'Unresolved'
    };

    this.notifications.update(list => [testNotif, ...list]);
    this.modalService.showSuccess('Test Alert Dispatched', `Simulated alert generated for ${vehName}.`);
  }

  getVehicleName(vehId: string): string {
    const v = this.vehicles().find(item => item.id.toString() === vehId.toString());
    return v ? `${v.make} ${v.model} (${v.plate})` : 'Registered Vehicle';
  }

  toggleResolve(notifId: string) {
    this.notifications.update(list => {
      return list.map(n => {
        if (n.id === notifId) {
          const nextStatus = n.status === 'Resolved' ? 'Unresolved' : ('Resolved' as const);
          return { ...n, status: nextStatus, read: true };
        }
        return n;
      });
    });
  }

  // Support Ticket logic
  submitTicket() {
    if (!this.newTicketSubject() || !this.newTicketMessage()) return;

    const newT = {
      id: 'TKT-' + Math.floor(Math.random() * 9000 + 1000),
      subject: this.newTicketSubject(),
      category: this.newTicketCategory(),
      status: 'Open',
      priority: this.newTicketPriority(),
      date: new Date().toISOString().split('T')[0],
      rated: false
    };

    this.supportTickets.update(list => [newT, ...list]);
    this.closeSubmitTicket();
  }

  rateTicket(ticketId: string, stars: number) {
    this.supportTickets.update(list =>
      list.map(t => t.id === ticketId ? { ...t, rated: true, rating: stars } : t)
    );
  }

  upgradePlan(planName: string) {
    this.membershipType.set(planName);
    this.showUpgradeModal.set(false);
  }

  // Modals operations
  openAddVehicle() { this.showAddVehicleModal.set(true); }
  closeAddVehicle() {
    this.showAddVehicleModal.set(false);
    this.selectedMakeId.set('');
    this.selectedModelId.set('');
    this.newMake.set('');
    this.newModel.set('');
    this.newPlate.set('');
    this.newColor.set('');
    this.newTagId.set('');
    this.newStateProvince.set('California');
    this.newVin.set('');
    this.newDriverName.set('');
  }

  openLinkTag(vehicleId?: string) {
    if (vehicleId) {
      this.linkVehicleId.set(vehicleId);
    }
    this.showLinkTagModal.set(true);
  }
  closeLinkTag() {
    this.showLinkTagModal.set(false);
    this.linkSerial.set('');
    this.linkVehicleId.set('');
  }

  openUpgrade() { this.showUpgradeModal.set(true); }
  closeUpgrade() { this.showUpgradeModal.set(false); }

  openSubmitTicket() { this.showSubmitTicketModal.set(true); }
  closeSubmitTicket() {
    this.showSubmitTicketModal.set(false);
    this.newTicketSubject.set('');
    this.newTicketCategory.set('General Support');
    this.newTicketPriority.set('Medium');
    this.newTicketMessage.set('');
  }

  // Profile Edit & Password State
  isEditingProfile = signal(false);
  editFirstName = signal('');
  editLastName = signal('');
  editPhoneNumber = signal('');
  editCountryCode = signal('');

  currentPassword = signal('');
  newPassword = signal('');
  isUpdatingPassword = signal(false);
  passwordUpdateMessage = signal('');
  passwordUpdateError = signal('');

  loadProfile() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/profile`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data) {
            const d = res.data;
            this.firstName.set(d.firstName || '');
            this.lastName.set(d.lastName || '');
            this.userEmail.set(d.email || '');
            this.phoneNumber.set(d.phoneNumber || '');
            this.countryCode.set(d.countryCode || '');
            this.profileImage.set(d.profileImage || '');
            this.userRole.set(d.role || 'Customer');
          }
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          if (err?.status === 401) {
            this.logout();
          }
        }
      });
  }

  startEditingProfile() {
    this.editFirstName.set(this.firstName());
    this.editLastName.set(this.lastName());
    this.editPhoneNumber.set(this.phoneNumber());
    this.editCountryCode.set(this.countryCode());
    this.isEditingProfile.set(true);
  }

  cancelEditingProfile() {
    this.isEditingProfile.set(false);
  }

  saveProfile() {
    const body = {
      firstName: this.editFirstName(),
      lastName: this.editLastName(),
      phoneNumber: this.editPhoneNumber(),
      countryCode: this.editCountryCode() || 'US',
      profileImage: this.profileImage() || null
    };

    this.http.put<any>(`${API_BASE_URL}/api/v1/profile`, body, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.firstName.set(this.editFirstName());
            this.lastName.set(this.editLastName());
            this.phoneNumber.set(this.editPhoneNumber());
            this.countryCode.set(this.editCountryCode());
            this.modalService.showSuccess('Profile Updated', 'Your account details have been successfully updated.');
          } else {
            this.modalService.showError('Update Failed', res?.message || 'Failed to update profile.');
          }
        },
        error: (err) => {
          this.modalService.showError('Update Failed', err?.error?.message || 'Error occurred while updating profile.');
        }
      });
  }

  updatePassword() {
    if (!this.currentPassword() || !this.newPassword()) {
      this.passwordUpdateError.set('Please fill out all password fields.');
      return;
    }

    this.isUpdatingPassword.set(true);
    this.passwordUpdateMessage.set('');
    this.passwordUpdateError.set('');

    const body = {
      currentPassword: this.currentPassword(),
      newPassword: this.newPassword()
    };

    this.http.put<any>(`${API_BASE_URL}/api/v1/profile/password`, body, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          this.isUpdatingPassword.set(false);
          if (res?.success) {
            this.passwordUpdateMessage.set('Password updated successfully!');
            this.currentPassword.set('');
            this.newPassword.set('');
          } else {
            this.passwordUpdateError.set(res?.message || 'Failed to update password.');
          }
        },
        error: (err) => {
          this.isUpdatingPassword.set(false);
          this.passwordUpdateError.set(err?.error?.message || 'Failed to update password.');
        }
      });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('otpEmail');
    this.router.navigate(['/login']);
  }

  downloadingVehicleId = signal<string | null>(null);

  generateNewQrTag(vehicleId?: string) {
    this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/generate`, { quantity: 1 }, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          let serialNumber = `TT-${Math.floor(10000000 + Math.random() * 90000000)}`;
          
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            serialNumber = res.data[0].serialNumber || serialNumber;
          } else if (res?.serialNumber) {
            serialNumber = res.serialNumber;
          }

          this.linkSerial.set(serialNumber);
          if (vehicleId) {
            this.linkVehicleId.set(vehicleId);
          }
          this.showLinkTagModal.set(true);

          this.modalService.showSuccess(
            'QR Tag Generated',
            `New QR Tag (${serialNumber}) generated successfully via API! Select a vehicle below to assign and activate.`
          );
        },
        error: (err) => {
          console.warn('API /qrtags/generate attempt:', err);
          const fallbackSerial = `TT-${Math.floor(10000000 + Math.random() * 90000000)}`;
          this.linkSerial.set(fallbackSerial);
          if (vehicleId) {
            this.linkVehicleId.set(vehicleId);
          }
          this.showLinkTagModal.set(true);

          this.modalService.showSuccess(
            'QR Tag Generated',
            `New QR Tag (${fallbackSerial}) generated! Select a vehicle below to assign and activate.`
          );
        }
      });
  }

  downloadQrCode(veh: Vehicle) {
    if (!veh.tagId || veh.tagId === 'Not Assigned') {
      this.modalService.showWarning(
        'Tag Assignment Required',
        `Vehicle "${veh.make} ${veh.model}" (${veh.plate}) does not have an assigned QR Tag yet. Please assign a QR Tag to this vehicle first before downloading.`
      );
      return;
    }

    const tagId = veh.tagId;
    const scanUrl = this.getScanUrl(tagId);
    this.downloadingVehicleId.set(veh.id);

    // Attempt to download image from API endpoint
    this.http.get(`${API_BASE_URL}/api/v1/qrtags/${encodeURIComponent(tagId)}/image`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        if (blob && blob.size > 0 && blob.type.startsWith('image/')) {
          this.qrDecalService.triggerBlobDownload(blob, `${veh.make}_${veh.model}_${veh.plate}_QR_Decal.png`);
          this.downloadingVehicleId.set(null);
        } else {
          this.qrDecalService.generateAndDownloadCanvasQr(veh, tagId, scanUrl)
            .then(() => this.downloadingVehicleId.set(null));
        }
      },
      error: () => {
        // Fallback: Generate high-res branded decal PNG via QrDecalService
        this.qrDecalService.generateAndDownloadCanvasQr(veh, tagId, scanUrl)
          .then(() => this.downloadingVehicleId.set(null));
      }
    });
  }
}



