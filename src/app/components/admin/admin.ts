import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  plan: string;
  status: 'Active' | 'Suspended';
  joinedDate: string;
}

interface AdminTag {
  serial: string;
  ownerEmail: string;
  plate: string;
  status: 'Active' | 'Inactive' | 'Lost/Stolen';
  scansCount: number;
}

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeTab = signal<'dashboard' | 'users' | 'tags' | 'enquiries' | 'gateways'>('dashboard');
  isMobileSidebarOpen = signal(false);

  // System Stats
  totalUsersCount = signal(1240);
  activeUsersCount = signal(982);
  totalVehiclesCount = signal(1843);
  totalTagsCount = signal(3102);
  membershipRevenue = signal(4580);
  ordersTodayCount = signal(24);
  ticketsTodayCount = signal(8);
  notificationsTodayCount = signal(134);

  // Users List
  users = signal<AdminUser[]>([
    { id: 'u1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 555-304-2911', role: 'Customer', plan: 'Free Plan', status: 'Active', joinedDate: '2026-05-10' },
    { id: 'u2', name: 'Marcus Brody', email: 'marcus.b@fleet.com', phone: '+1 555-890-4109', role: 'Fleet Manager', plan: 'Premium Fleet', status: 'Active', joinedDate: '2026-02-14' },
    { id: 'u3', name: 'Liam O\'Connor', email: 'liam.oc@example.com', phone: '+1 555-718-2044', role: 'Customer', plan: 'Premium Monthly', status: 'Suspended', joinedDate: '2026-06-22' },
    { id: 'u4', name: 'Clara Oswald', email: 'clara@support.trafftag.com', phone: '+1 555-901-3820', role: 'Support Agent', plan: 'Free Plan', status: 'Active', joinedDate: '2026-01-08' }
  ]);

  // QR Tags list
  tags = signal<AdminTag[]>([
    { serial: 'TT-482-901', ownerEmail: 'sarah.j@example.com', plate: 'EVE-9032', status: 'Active', scansCount: 14 },
    { serial: 'TT-718-204', ownerEmail: 'sarah.j@example.com', plate: 'HRT-4109', status: 'Active', scansCount: 3 },
    { serial: 'TT-109-883', ownerEmail: 'marcus.b@fleet.com', plate: 'FLT-001A', status: 'Active', scansCount: 42 },
    { serial: 'TT-901-382', ownerEmail: 'liam.oc@example.com', plate: 'XYZ-1029', status: 'Lost/Stolen', scansCount: 0 },
    { serial: 'TT-331-508', ownerEmail: 'None (Unassigned)', plate: 'N/A', status: 'Inactive', scansCount: 0 }
  ]);

  // Enquiries & Support tickets
  enquiries = signal([
    { id: 'ENQ-201', name: 'John Doe', email: 'john@example.com', phone: '+1 555-019-2831', subject: 'Custom fleet pricing request', message: 'Hi, we have 45 taxis in our fleet and we want custom high-durability tags.', status: 'Pending', date: '2026-07-16' },
    { id: 'ENQ-202', name: 'Alice Smith', email: 'alice@gmail.com', phone: '+1 555-098-1122', subject: 'Sticker shipping inquiry', message: 'Does shipping take longer than 3 days to Texas?', status: 'Resolved', date: '2026-07-15' },
    { id: 'ENQ-203', name: 'Bob Johnson', email: 'bob.j@corp.com', phone: '+1 555-123-4567', subject: 'Refund request', message: 'I purchased the annual premium, but my car was sold. Can I get a partial refund?', status: 'Pending', date: '2026-07-14' }
  ]);

  // Gateways status
  gateways = signal([
    { name: 'Primary Database (PostgreSQL)', status: 'online', latency: '12ms', cpu: '14%', load: 'Normal' },
    { name: 'Cache Cluster (Redis)', status: 'online', latency: '2ms', cpu: '8%', load: 'Low' },
    { name: 'Message Queue (RabbitMQ)', status: 'online', latency: '5ms', cpu: '11%', load: 'Normal' },
    { name: 'Assets Storage (AWS S3)', status: 'online', latency: '45ms', cpu: 'N/A', load: 'Normal' },
    { name: 'Email Gateway (SendGrid)', status: 'online', latency: '120ms', cpu: 'N/A', load: 'Normal' },
    { name: 'SMS Gateway (Twilio)', status: 'online', latency: '98ms', cpu: 'N/A', load: 'Normal' }
  ]);

  // Generate tag modal fields
  showGenerateModal = signal(false);
  bulkQuantity = signal(10);
  prefix = signal('TT');

  // Search & Filter state
  userSearchQuery = signal('');
  userRoleFilter = signal('all');
  userPlanFilter = signal('all');
  userStatusFilter = signal('all');

  tagSearchQuery = signal('');
  tagStatusFilter = signal('all');

  // Computed filtered users
  filteredUsers = computed(() => {
    const query = this.userSearchQuery().toLowerCase();
    const role = this.userRoleFilter();
    const plan = this.userPlanFilter();
    const status = this.userStatusFilter();

    return this.users().filter(u => {
      const matchesSearch = !query || 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) ||
        (u.phone && u.phone.includes(query));

      const matchesRole = role === 'all' || u.role.toLowerCase() === role.toLowerCase();
      const matchesPlan = plan === 'all' || u.plan.toLowerCase().includes(plan.toLowerCase());
      const matchesStatus = status === 'all' || u.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesRole && matchesPlan && matchesStatus;
    });
  });

  // Computed filtered tags
  filteredTags = computed(() => {
    const query = this.tagSearchQuery().toLowerCase();
    const status = this.tagStatusFilter();

    return this.tags().filter(t => {
      const matchesSearch = !query || 
        t.serial.toLowerCase().includes(query) || 
        t.ownerEmail.toLowerCase().includes(query) || 
        t.plate.toLowerCase().includes(query);

      const matchesStatus = status === 'all' || t.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const sub = params.get('subpage');
      if (sub && ['dashboard', 'users', 'tags', 'enquiries', 'gateways'].includes(sub)) {
        this.activeTab.set(sub as any);
      } else {
        this.router.navigate(['/admin', 'dashboard'], { replaceUrl: true });
      }
    });
  }

  selectTab(tab: 'dashboard' | 'users' | 'tags' | 'enquiries' | 'gateways') {
    this.activeTab.set(tab);
    this.isMobileSidebarOpen.set(false);
    this.router.navigate(['/admin', tab]);
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  generateTagsBulk() {
    const newTags: AdminTag[] = [];
    for (let i = 0; i < this.bulkQuantity(); i++) {
      const p1 = Math.floor(100 + Math.random() * 900);
      const p2 = Math.floor(100 + Math.random() * 900);
      const serial = `${this.prefix()}-${p1}-${p2}`;
      newTags.push({
        serial: serial,
        ownerEmail: 'None (Unassigned)',
        plate: 'N/A',
        status: 'Inactive',
        scansCount: 0
      });
    }

    this.tags.update(list => [...list, ...newTags]);
    this.totalTagsCount.update(val => val + this.bulkQuantity());
    this.showGenerateModal.set(false);
  }

  toggleUserStatus(userId: string) {
    this.users.update(list => {
      return list.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : ('Active' as const);
          return { ...u, status: nextStatus };
        }
        return u;
      });
    });
  }

  updateTagStatus(serial: string, nextStatus: 'Active' | 'Inactive' | 'Lost/Stolen') {
    this.tags.update(list => {
      return list.map(t => {
        if (t.serial === serial) {
          return { ...t, status: nextStatus };
        }
        return t;
      });
    });
  }

  resolveEnquiry(enqId: string) {
    this.enquiries.update(list =>
      list.map(e => e.id === enqId ? { ...e, status: 'Resolved' } : e)
    );
  }
}
