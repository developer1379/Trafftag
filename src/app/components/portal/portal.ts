import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';

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

  // Navigation
  activeTab = signal<'dashboard' | 'vehicles' | 'tags' | 'notifications' | 'support'>('dashboard');
  isMobileSidebarOpen = signal(false);

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  // User & Membership Details
  userName = signal('Sarah Jenkins');
  userEmail = signal('sarah.j@example.com');
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

  // Vehicles List
  vehicles = signal<Vehicle[]>([
    {
      id: 'v1',
      make: 'Tesla',
      model: 'Model Y',
      year: 2023,
      plate: 'EVE-9032',
      color: 'Solid Black',
      stateProvince: 'California',
      vin: '5YJYG1EE8PF192032',
      driverName: 'Sarah Jenkins',
      totalScans: 14,
      lastScan: '2 hours ago',
      prefSMS: true,
      prefEmail: true,
      tagId: 'TT-482-901',
      active: true
    },
    {
      id: 'v2',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      plate: 'HRT-4109',
      color: 'Lunar Silver',
      stateProvince: 'New York',
      vin: '1HGCP2F81LA092811',
      driverName: 'John Jenkins',
      totalScans: 3,
      lastScan: '3 days ago',
      prefSMS: true,
      prefEmail: false,
      tagId: 'TT-718-204',
      active: true
    }
  ]);

  // Tag counters
  activeTagsCount = computed(() => this.vehicles().filter(v => v.tagId && v.tagId !== 'Not Assigned' && v.active).length);
  inactiveTagsCount = computed(() => this.vehicles().filter(v => !v.tagId || v.tagId === 'Not Assigned' || !v.active).length);

  // Notifications List
  notifications = signal<QRNotification[]>([
    {
      id: 'n1',
      vehicleId: 'v1',
      timestamp: '2026-07-16 14:32',
      category: 'Headlights Left On',
      icon: 'fa-solid fa-lightbulb',
      message: 'Hey, your front left fog lights and low beams are still on.',
      senderPhone: '+1 (555) 304-2911',
      read: false,
      status: 'Unresolved'
    },
    {
      id: 'n2',
      vehicleId: 'v2',
      timestamp: '2026-07-14 09:15',
      category: 'Parking Obstruction',
      icon: 'fa-solid fa-square-parking',
      message: 'Blocked my driveway, but no worries, just let me know if you can move it in 10 mins.',
      read: true,
      status: 'Resolved'
    },
    {
      id: 'n3',
      vehicleId: 'v1',
      timestamp: '2026-07-10 18:40',
      category: 'Window Rolled Down',
      icon: 'fa-solid fa-window-maximize',
      message: 'Driver side window is completely open. Looks like it might rain later.',
      read: true,
      status: 'Resolved'
    }
  ]);

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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const sub = params.get('subpage');
      if (sub && ['dashboard', 'vehicles', 'tags', 'notifications', 'support'].includes(sub)) {
        this.activeTab.set(sub as any);
      } else {
        this.router.navigate(['/portal', 'dashboard'], { replaceUrl: true });
      }
    });
  }

  selectTab(tab: 'dashboard' | 'vehicles' | 'tags' | 'notifications' | 'support') {
    this.activeTab.set(tab);
    this.isMobileSidebarOpen.set(false);
    this.router.navigate(['/portal', tab]);
  }

  addVehicle() {
    if (!this.newMake() || !this.newModel() || !this.newPlate()) return;
    
    const newV: Vehicle = {
      id: 'v_' + Math.random().toString(36).substr(2, 9),
      make: this.newMake(),
      model: this.newModel(),
      year: this.newYear(),
      plate: this.newPlate().toUpperCase(),
      color: this.newColor() || 'Unknown',
      stateProvince: this.newStateProvince() || 'California',
      vin: this.newVin() || 'N/A',
      driverName: this.newDriverName() || this.userName(),
      totalScans: 0,
      lastScan: 'Never',
      prefSMS: true,
      prefEmail: true,
      tagId: this.newTagId() || 'Not Assigned',
      active: true
    };

    this.vehicles.update(list => [...list, newV]);
    this.closeAddVehicle();
  }

  deleteVehicle(id: string) {
    this.vehicles.update(list => list.filter(v => v.id !== id));
  }

  toggleVehicleActive(id: string) {
    this.vehicles.update(list => 
      list.map(v => v.id === id ? { ...v, active: !v.active } : v)
    );
  }

  linkTag() {
    if (!this.linkSerial() || !this.linkVehicleId()) return;

    this.vehicles.update(list => {
      return list.map(v => {
        if (v.id === this.linkVehicleId()) {
          return { ...v, tagId: this.linkSerial() };
        }
        return v;
      });
    });

    this.closeLinkTag();
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
    this.newMake.set('');
    this.newModel.set('');
    this.newPlate.set('');
    this.newColor.set('');
    this.newTagId.set('');
    this.newStateProvince.set('California');
    this.newVin.set('');
    this.newDriverName.set('');
  }

  openLinkTag() { this.showLinkTagModal.set(true); }
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
}
