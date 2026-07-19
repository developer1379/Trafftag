import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alerts-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts-tab.component.html',
  styleUrl: './alerts-tab.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AlertsTabComponent {
  @Input() notifications: any[] = [];
  @Input() filteredNotifications: any[] = [];
  @Input() vehicles: any[] = [];
  @Input() searchQuery = '';
  @Input() filterVehicle = 'all';
  @Input() filterCategory = 'all';
  @Input() filterStatus = 'all';

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() filterVehicleChange = new EventEmitter<string>();
  @Output() filterCategoryChange = new EventEmitter<string>();
  @Output() filterStatusChange = new EventEmitter<string>();

  @Output() markAsRead = new EventEmitter<string>();
  @Output() markAllAsRead = new EventEmitter<void>();
  @Output() toggleResolve = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  getVehicleName(vehId: string): string {
    const v = this.vehicles.find(item => item.id === vehId);
    return v ? `${v.make} ${v.model} (${v.plate})` : 'Registered Vehicle';
  }
}
