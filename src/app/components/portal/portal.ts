import { Component, OnInit, signal, inject, computed, ViewEncapsulation } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  encapsulation: ViewEncapsulation.None
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

  // Membership Plans list from API
  membershipPlans = signal<any[]>([]);

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
  
  userMembershipId = signal<number | null>(null);
  generatedTagId = signal<number | null>(null);
  qrImageBase64 = signal<string | null>(null);

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

    this.route.queryParamMap.subscribe(params => {
      const paymentStatus = params.get('payment');
      if (paymentStatus === 'success') {
        this.modalService.showSuccess(
          'Payment Successful',
          'Thank you for upgrading! Your membership is now active.'
        );
        this.router.navigate([], {
          queryParams: { payment: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      } else if (paymentStatus === 'cancelled') {
        this.modalService.showWarning(
          'Payment Cancelled',
          'Checkout was cancelled. You can try again when you are ready.'
        );
        this.router.navigate([], {
          queryParams: { payment: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
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
      this.loadVehicles();
      this.loadProfile();
      this.loadUserMemberships();
      this.loadNotifications();
      this.loadMembershipPlans();
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
    
    // Check if we already have the generated tag ID matching the current serial
    let tagId = this.generatedTagId();
    
    const proceedWithAssign = (resolvedTagId: number) => {
      const body = {
        vehicleId: parseInt(vehicleIdStr, 10)
      };

      this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/${resolvedTagId}/assign`, body, { headers: this.getHeaders() })
        .subscribe({
          next: (res) => {
            // Save to local storage for persistent display matching
            localStorage.setItem(`assigned_tag_${vehicleIdStr}`, serialStr);
            this.loadVehicles();
            this.closeLinkTag();
            this.modalService.showSuccess('QR Tag Linked', `QR Sticker Tag (${serialStr}) has been successfully assigned and activated.`);
          },
          error: (err) => {
            console.error('Error assigning QR Tag:', err);
            this.modalService.showError('Assignment Failed', err?.error?.message || 'Could not link QR tag to vehicle.');
          }
        });
    };

    if (tagId) {
      proceedWithAssign(tagId);
    } else {
      // Look up tagId by querying the QR tag details by serial number
      this.http.get<any>(`${API_BASE_URL}/api/v1/qrtags/${encodeURIComponent(serialStr)}`, { headers: this.getHeaders() })
        .subscribe({
          next: (res) => {
            const resolvedId = res?.qrTagId || res?.id || res?.data?.qrTagId || res?.data?.id;
            if (resolvedId) {
              proceedWithAssign(resolvedId);
            } else {
              // Fallback: extract numeric value from serial
              const match = serialStr.match(/\d+$/);
              const fallbackId = match ? parseInt(match[0], 10) : null;
              if (fallbackId) {
                proceedWithAssign(fallbackId);
              } else {
                this.modalService.showError('Error', 'Could not resolve the QR tag ID for this serial number.');
              }
            }
          },
          error: (err) => {
            // Fallback: extract numeric value from serial
            const match = serialStr.match(/\d+$/);
            const fallbackId = match ? parseInt(match[0], 10) : null;
            if (fallbackId) {
              proceedWithAssign(fallbackId);
            } else {
              this.modalService.showError('Error', 'Could not locate QR tag by serial number.');
            }
          }
        });
    }
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

  upgradePlan(planId: number) {
    const payload = {
      checkoutType: 'Membership',
      planId: planId,
      successUrl: `${window.location.origin}/portal/dashboard?payment=success`,
      cancelUrl: `${window.location.origin}/portal/dashboard?payment=cancelled`
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/payments/checkout`, payload, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          this.showUpgradeModal.set(false);
          const checkoutUrl = typeof res === 'string' ? res : (res?.url || res?.data?.url || res?.data);
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            this.modalService.showError('Payment Error', 'Failed to retrieve Stripe Checkout session URL.');
          }
        },
        error: (err) => {
          console.error('Error creating checkout session:', err);
          this.modalService.showError('Payment Error', err?.error?.message || 'Could not initiate payment process.');
        }
      });
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
    this.qrImageBase64.set(null);
    this.generatedTagId.set(null);
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
            this.membershipType.set(d.activeMembership || 'Free Plan');
            
            // Extract membership ID if available
            if (d.userMembershipId || d.activeMembershipId || d.membershipId) {
              this.userMembershipId.set(d.userMembershipId || d.activeMembershipId || d.membershipId);
            }
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

  loadUserMemberships() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/memberships`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          const list = Array.isArray(res) ? res : (res?.data || res?.data?.data || []);
          if (list.length > 0) {
            const active = list.find((m: any) => m.status === 'Active' || m.isActive) || list[0];
            const membershipId = active.userMembershipId || active.id;
            if (membershipId) {
              this.userMembershipId.set(membershipId);
            }
          }
        },
        error: (err) => {
          console.warn('Could not fetch memberships from /api/v1/memberships, trying user-memberships...', err);
          this.http.get<any>(`${API_BASE_URL}/api/v1/user-memberships`, { headers: this.getHeaders() })
            .subscribe({
              next: (res2) => {
                const list2 = Array.isArray(res2) ? res2 : (res2?.data || res2?.data?.data || []);
                if (list2.length > 0) {
                  const active2 = list2.find((m: any) => m.status === 'Active' || m.isActive) || list2[0];
                  const membershipId2 = active2.userMembershipId || active2.id;
                  if (membershipId2) {
                    this.userMembershipId.set(membershipId2);
                  }
                }
              }
            });
        }
      });
  }

  loadMembershipPlans() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/memberships/plans`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          if (res?.success && Array.isArray(res.data)) {
            this.membershipPlans.set(res.data);
          } else if (Array.isArray(res)) {
            this.membershipPlans.set(res);
          }
        },
        error: (err) => {
          console.error('Error loading membership plans:', err);
        }
      });
  }

  getPlanFeatures(plan: any): string[] {
    const name = (plan?.name || '').toLowerCase();
    if (name.includes('free')) {
      return ['Up to 2 Registered Vehicles', '10 Alert Scans / month', 'Email Alert Notifications'];
    }
    if (name.includes('monthly')) {
      return ['Unlimited Vehicles Protection', 'Unlimited Scan Alerts', 'Instant SMS & Email Notifications', 'Matte Finish QR Decals'];
    }
    if (name.includes('annual') || name.includes('yearly')) {
      return ['Unlimited Vehicles Protection', 'Unlimited Scan Alerts', 'Save 17% (2 Months Free)', 'Priority Support & Free Decals'];
    }
    if (name.includes('lifetime') || name.includes('life')) {
      return ['Unlimited Vehicles Protection', 'Unlimited Scan Alerts', 'One-time Payment (No Recurrent Fees)', 'Lifetime Support & Free Decals'];
    }
    return ['Active Vehicle Protection', 'Alert scan notification'];
  }

  redirectToBillingPortal() {
    const payload = {
      returnUrl: `${window.location.origin}/portal/profile`
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/payments/portal`, payload, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          const portalUrl = typeof res === 'string' ? res : (res?.url || res?.data?.url || res?.data);
          if (portalUrl) {
            window.location.href = portalUrl;
          } else {
            this.modalService.showError('Billing Portal Error', 'Failed to retrieve Stripe Customer Portal session URL.');
          }
        },
        error: (err) => {
          console.error('Error redirecting to billing portal:', err);
          this.modalService.showError('Billing Portal Error', err?.error?.message || 'Could not initiate Stripe Customer Portal.');
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
    const memId = this.userMembershipId();
    if (!memId) {
      this.modalService.showWarning(
        'Active Membership Required',
        'We could not find an active membership ID on your account. Please purchase a membership plan or try again.'
      );
      return;
    }

    const payload = {
      userMembershipId: memId
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/generate`, payload, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          let serialNumber = `TT-${Math.floor(10000000 + Math.random() * 90000000)}`;
          let qrImage = '';
          let resolvedTagId: number | null = null;
          
          if (res?.data) {
            const d = res.data;
            serialNumber = d.serialNumber || serialNumber;
            qrImage = d.qrImageBase64 || '';
            resolvedTagId = d.qrTagId || null;
          } else if (res?.serialNumber) {
            serialNumber = res.serialNumber;
            qrImage = res.qrImageBase64 || '';
            resolvedTagId = res.qrTagId || null;
          }

          this.linkSerial.set(serialNumber);
          if (resolvedTagId) {
            this.generatedTagId.set(resolvedTagId);
          }
          if (qrImage) {
            this.qrImageBase64.set(qrImage);
          }
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
          this.modalService.showError(
            'QR Tag Generation Failed',
            err?.error?.message || 'Could not generate QR tag. Ensure your membership is active.'
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



