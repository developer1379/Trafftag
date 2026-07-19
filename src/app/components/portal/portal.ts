import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';
import { ModalService } from '../../services/modal.service';

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
  imports: [FormsModule, RouterLink, UpperCasePipe],
  templateUrl: './portal.html',
  styleUrl: './portal.css',
})
export class Portal implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private modalService = inject(ModalService);

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
    return {
      id: apiV.vehicleId.toString(),
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
      tagId: apiV.activeQrTag || 'Not Assigned',
      active: apiV.status === 'Active'
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
    const match = serialStr.match(/\d+/);
    const tagId = match ? parseInt(match[0], 10) : null;

    if (!tagId) {
      this.modalService.showWarning('Invalid Format', 'Invalid QR Sticker Serial format. Must contain a numeric ID (e.g. TT-00000021).');
      return;
    }

    const body = {
      vehicleId: parseInt(this.linkVehicleId(), 10)
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/${tagId}/assign`, body, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.loadVehicles();
            this.closeLinkTag();
            this.modalService.showSuccess('QR Tag Linked', 'Your QR Sticker Tag has been successfully assigned and activated.');
          } else {
            this.modalService.showError('Activation Failed', res?.message || 'Failed to link QR decal.');
          }
        },
        error: (err) => {
          this.modalService.showError('Activation Failed', err?.error?.message || 'Error occurred while linking QR decal.');
        }
      });
  }

  // Alerts logic
  markAsRead(notifId: string) {
    this.notifications.update(list => {
      return list.map(n => n.id === notifId ? { ...n, read: true } : n);
    });
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

  downloadQrCode(veh: Vehicle) {
    const tagId = veh.tagId && veh.tagId !== 'Not Assigned' ? veh.tagId : `TT-VEH-${veh.id}`;
    const scanUrl = this.getScanUrl(tagId);
    this.downloadingVehicleId.set(veh.id);

    // Attempt to download image from API endpoint
    this.http.get(`${API_BASE_URL}/api/v1/qrtags/${encodeURIComponent(tagId)}/image`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        if (blob && blob.size > 0 && blob.type.startsWith('image/')) {
          this.triggerBlobDownload(blob, `${veh.make}_${veh.model}_${veh.plate}_QR_Decal.png`);
          this.downloadingVehicleId.set(null);
        } else {
          this.generateAndDownloadCanvasQr(veh, tagId, scanUrl);
        }
      },
      error: () => {
        // Fallback: Generate high-res branded decal PNG via Canvas
        this.generateAndDownloadCanvasQr(veh, tagId, scanUrl);
      }
    });
  }

  private triggerBlobDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private generateAndDownloadCanvasQr(veh: Vehicle, tagId: string, scanUrl: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      this.downloadingVehicleId.set(null);
      return;
    }

    const goldColor = '#F5B800';
    const darkNavy = '#060F1E';
    const cardNavy = '#0B1B36';
    const whiteColor = '#FFFFFF';
    const textGold = '#FFC107';

    // Fill Canvas Background
    ctx.fillStyle = darkNavy;
    ctx.fillRect(0, 0, 1200, 700);

    // ==========================================
    // LEFT SHIELD BADGE (cx: 220, cy: 350)
    // ==========================================
    const cx = 220;
    const cy = 350;

    const drawShield = (wScale: number, hScale: number) => {
      const w = 360 * wScale;
      const h = 570 * hScale;
      const hw = w / 2;
      const hh = h / 2;
      const topY = cy - hh;
      const botY = cy + hh;

      ctx.beginPath();
      ctx.moveTo(cx, topY);
      ctx.bezierCurveTo(cx + hw * 0.45, topY - 4, cx + hw * 0.85, topY + 12, cx + hw, topY + 45);
      ctx.bezierCurveTo(cx + hw * 1.08, cy - hh * 0.25, cx + hw * 0.95, cy + hh * 0.35, cx + hw * 0.72, cy + hh * 0.68);
      ctx.bezierCurveTo(cx + hw * 0.5, cy + hh * 0.88, cx + hw * 0.2, botY, cx, botY + 15);
      ctx.bezierCurveTo(cx - hw * 0.2, botY, cx - hw * 0.5, cy + hh * 0.88, cx - hw * 0.72, cy + hh * 0.68);
      ctx.bezierCurveTo(cx - hw * 0.95, cy + hh * 0.35, cx - hw * 1.08, cy - hh * 0.25, cx - hw, topY + 45);
      ctx.bezierCurveTo(cx - hw * 0.85, topY + 12, cx - hw * 0.45, topY - 4, cx, topY);
      ctx.closePath();
    };

    // 1. Outer Gold Shield
    drawShield(1.0, 1.0);
    ctx.fillStyle = goldColor;
    ctx.fill();

    // 2. Inner Navy Fill
    drawShield(0.93, 0.94);
    ctx.fillStyle = cardNavy;
    ctx.fill();

    // 3. Inner Gold Border Line
    drawShield(0.88, 0.90);
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Top Header: ★ TAG IT WITH LOVE ★
    ctx.fillStyle = textGold;
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★   TAG IT WITH LOVE   ★', cx, cy - 195);

    // Main Brand Title: TRAFFTAG
    ctx.fillStyle = whiteColor;
    ctx.font = '900 46px "Impact", "Arial Black", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 4;
    ctx.fillText('TRAFFTAG', cx, cy - 138);
    ctx.shadowColor = 'transparent';

    // Sub Ribbon: ═ MEANS ═
    ctx.fillStyle = textGold;
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.fillText('═ MEANS ═', cx, cy - 95);

    // WE HELP YOU
    ctx.fillStyle = whiteColor;
    ctx.font = '900 24px Arial, sans-serif';
    ctx.fillText('WE HELP YOU', cx, cy - 60);

    // ALERT.
    ctx.fillStyle = textGold;
    ctx.font = '900 62px "Impact", "Arial Black", sans-serif';
    ctx.fillText('ALERT.', cx, cy + 5);

    // Sound Wave Bell Ring
    const ringY = cy + 112;
    ctx.beginPath();
    ctx.arc(cx, ringY, 46, 0, Math.PI * 2);
    ctx.fillStyle = darkNavy;
    ctx.fill();
    ctx.strokeStyle = textGold;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = textGold;
    ctx.font = 'bold 19px Arial, sans-serif';
    ctx.fillText('(((', cx - 28, ringY + 2);
    ctx.fillText(')))', cx + 28, ringY + 2);
    ctx.font = '28px Arial, sans-serif';
    ctx.fillText('🔔', cx, ringY + 8);

    // Bottom Star
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText('★', cx, cy + 205);

    // ==========================================
    // RIGHT CONTAINER CARD (rx: 430, ry: 30, rw: 740, rh: 640)
    // ==========================================
    const rx = 430;
    const ry = 30;
    const rw = 740;
    const rh = 640;

    // Outer Navy Fill & Gold Border
    ctx.fillStyle = cardNavy;
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 16);
    ctx.fill();
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Bar 1: Top Gold Header (y: 34 to 82)
    ctx.fillStyle = goldColor;
    ctx.beginPath();
    ctx.roundRect(rx + 4, ry + 4, rw - 8, 48, [12, 12, 0, 0]);
    ctx.fill();

    ctx.fillStyle = darkNavy;
    ctx.font = '900 22px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('100% FREE TO SCAN • NOTIFY • SMILE', rx + rw / 2, ry + 36);

    // Bar 2: Dark Subheader (y: 82 to 120)
    ctx.fillStyle = '#000000';
    ctx.fillRect(rx + 4, ry + 52, rw - 8, 38);

    ctx.fillStyle = textGold;
    ctx.font = '900 16px Arial, sans-serif';
    ctx.fillText('PLEASE SCAN ME SO I CAN TELL MY OWNER.', rx + rw / 2, ry + 77);

    // Main QR Box (Left side of right card)
    const qrBoxX = rx + 20;
    const qrBoxY = ry + 105;
    const qrSize = 250;

    ctx.fillStyle = whiteColor;
    ctx.beginPath();
    ctx.roundRect(qrBoxX, qrBoxY, qrSize, qrSize, 14);
    ctx.fill();
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Right Column 3 Info Boxes (x: 715, infoW: 435)
    const infoX = rx + 285;
    const infoW = 435;

    const serialNum = tagId.replace(/^TT-/, '') || '00012345';
    const alphaNum = `7G9H-K2M4-${veh.id.padStart(4, '0')}`;

    // Item 1: TRAFFTAG ID (y: 105, h: 74)
    ctx.fillStyle = '#071224';
    ctx.beginPath();
    ctx.roundRect(infoX, ry + 105, infoW, 74, 10);
    ctx.fill();
    ctx.strokeStyle = '#172746';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = textGold;
    ctx.beginPath();
    ctx.roundRect(infoX + 12, ry + 120, 42, 44, 8);
    ctx.fill();
    ctx.fillStyle = darkNavy;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🛡️', infoX + 33, ry + 149);

    ctx.fillStyle = textGold;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('TRAFFTAG ID', infoX + 66, ry + 148);

    ctx.fillStyle = whiteColor;
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`:  ${tagId}`, infoX + 220, ry + 148);

    // Item 2: SERIAL NUMBER (y: 193, h: 74)
    ctx.fillStyle = '#071224';
    ctx.beginPath();
    ctx.roundRect(infoX, ry + 193, infoW, 74, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textGold;
    ctx.beginPath();
    ctx.roundRect(infoX + 12, ry + 208, 42, 44, 8);
    ctx.fill();
    ctx.fillStyle = darkNavy;
    ctx.font = '900 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('#', infoX + 33, ry + 237);

    ctx.fillStyle = textGold;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('SERIAL NUMBER', infoX + 66, ry + 236);

    ctx.fillStyle = whiteColor;
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`:  ${serialNum.padStart(8, '0')}`, infoX + 220, ry + 236);

    // Item 3: ALPHANUMERIC NUMBER (y: 281, h: 74)
    ctx.fillStyle = '#071224';
    ctx.beginPath();
    ctx.roundRect(infoX, ry + 281, infoW, 74, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textGold;
    ctx.beginPath();
    ctx.roundRect(infoX + 12, ry + 296, 42, 44, 8);
    ctx.fill();
    ctx.fillStyle = darkNavy;
    ctx.font = '900 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('A1', infoX + 33, ry + 324);

    ctx.fillStyle = textGold;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('ALPHANUMERIC NUMBER', infoX + 66, ry + 324);

    ctx.fillStyle = whiteColor;
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`: ${alphaNum}`, infoX + 268, ry + 324);

    // Row 2: Car Nick Name & Vehicle Type (y: 370, h: 84)
    const midY = ry + 370;
    const box1W = 340;
    const box2W = 340;

    // Nick Name Box
    ctx.fillStyle = '#071224';
    ctx.beginPath();
    ctx.roundRect(qrBoxX, midY, box1W, 84, 10);
    ctx.fill();
    ctx.strokeStyle = textGold;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const nickStr = (veh.make && veh.make !== 'Unknown' ? `${veh.make} ${veh.model || ''}` : (veh.model || 'MY CAR')).trim().toUpperCase();

    ctx.fillStyle = textGold;
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤 MY CAR NICK NAME IS', qrBoxX + box1W / 2, midY + 28);

    ctx.fillStyle = whiteColor;
    ctx.font = '900 22px Arial';
    ctx.fillText(nickStr, qrBoxX + box1W / 2, midY + 60);

    // Vehicle Type Box
    ctx.fillStyle = '#071224';
    ctx.beginPath();
    ctx.roundRect(rx + 380, midY, box2W, 84, 10);
    ctx.fill();
    ctx.stroke();

    const typeStr = (veh.color && veh.color !== 'Unknown' ? `${veh.color} ${veh.make || 'CAR'}` : (veh.make && veh.make !== 'Unknown' ? veh.make : 'CAR')).toUpperCase();

    ctx.fillStyle = textGold;
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚗 VEHICLE TYPE', rx + 380 + box2W / 2, midY + 28);

    ctx.fillStyle = whiteColor;
    ctx.font = '900 22px Arial';
    ctx.fillText(typeStr, rx + 380 + box2W / 2, midY + 60);

    // Row 3: Call/Text Support Box & Checklist (y: 468, h: 104)
    const helpY = ry + 468;
    ctx.fillStyle = '#071224';
    ctx.beginPath();
    ctx.roundRect(qrBoxX, helpY, rw - 40, 104, 12);
    ctx.fill();
    ctx.strokeStyle = '#172746';
    ctx.stroke();

    // Left Contact Info
    ctx.fillStyle = textGold;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('📞 NEED HELP? CALL OR TEXT TRAFFTAG', qrBoxX + 20, helpY + 34);

    ctx.fillStyle = whiteColor;
    ctx.font = '900 28px Arial';
    ctx.fillText('+1 (212) 470-8284', qrBoxX + 20, helpY + 74);

    // Divider line
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(qrBoxX + 390, helpY + 12);
    ctx.lineTo(qrBoxX + 390, helpY + 92);
    ctx.stroke();

    // Right Checklist
    ctx.fillStyle = textGold;
    ctx.font = 'bold 13px Arial';
    ctx.fillText('PLEASE INCLUDE:', qrBoxX + 410, helpY + 26);

    ctx.fillStyle = whiteColor;
    ctx.font = 'bold 12px Arial';
    ctx.fillText('✔  TRAFFTAG ID', qrBoxX + 410, helpY + 46);
    ctx.fillText('✔  SERIAL NUMBER', qrBoxX + 410, helpY + 64);
    ctx.fillText('✔  YOUR MESSAGE OR PHOTO (OPTIONAL)', qrBoxX + 410, helpY + 82);

    // Bottom Message Bar (y: 602)
    ctx.fillStyle = textGold;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✉️   MESSAGE WILL BE FORWARDED TO OWNER.', rx + rw / 2, ry + 604);

    // Draw QR Code Image into box
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(scanUrl)}`;
    const qrImg = new Image();
    qrImg.crossOrigin = 'Anonymous';
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrBoxX + 10, qrBoxY + 10, 230, 230);

      // Center Bell Badge overlay on QR code
      const cxQr = qrBoxX + 125;
      const cyQr = qrBoxY + 125;

      ctx.fillStyle = textGold;
      ctx.beginPath();
      ctx.roundRect(cxQr - 24, cyQr - 26, 48, 52, 10);
      ctx.fill();

      ctx.fillStyle = darkNavy;
      ctx.beginPath();
      ctx.roundRect(cxQr - 21, cyQr - 23, 42, 46, 8);
      ctx.fill();

      ctx.fillStyle = textGold;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('((( 🔔 )))', cxQr, cyQr + 5);

      canvas.toBlob((blob) => {
        this.downloadingVehicleId.set(null);
        if (blob) {
          this.triggerBlobDownload(blob, `${veh.make}_${veh.model}_${veh.plate}_TRAFFTAG_Decal.png`);
        }
      });
    };

    qrImg.onerror = () => {
      this.downloadingVehicleId.set(null);
      canvas.toBlob((blob) => {
        if (blob) {
          this.triggerBlobDownload(blob, `${veh.make}_${veh.model}_${veh.plate}_TRAFFTAG_Decal.png`);
        }
      });
    };

    qrImg.src = qrImgUrl;
  }
}
