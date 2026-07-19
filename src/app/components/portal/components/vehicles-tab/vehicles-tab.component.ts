import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vehicles-tab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicles-tab.component.html',
  styleUrl: './vehicles-tab.component.css'
})
export class VehiclesTabComponent {
  @Input() vehicles: any[] = [];
  @Input() downloadingVehicleId: string | null = null;
  @Input() membershipType = 'Free Plan';

  @Output() addVehicleClick = new EventEmitter<void>();
  @Output() downloadQr = new EventEmitter<any>();
  @Output() generateQr = new EventEmitter<string>();
  @Output() deleteVehicle = new EventEmitter<string>();
  @Output() toggleActive = new EventEmitter<any>();
}
