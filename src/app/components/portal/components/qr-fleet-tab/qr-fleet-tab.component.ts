import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-qr-fleet-tab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './qr-fleet-tab.component.html',
  styleUrl: './qr-fleet-tab.component.css',
  encapsulation: ViewEncapsulation.None
})
export class QrFleetTabComponent {
  @Input() vehicles: any[] = [];
  @Input() downloadingVehicleId: string | null = null;
  @Input() membershipType = 'Free Plan';
  @Input() scanUrlFn!: (tagId: string) => string;

  @Output() generateNewQr = new EventEmitter<void>();
  @Output() openLinkTag = new EventEmitter<string | undefined>();
  @Output() downloadQr = new EventEmitter<any>();

  getScanUrl(tagId: string): string {
    return this.scanUrlFn ? this.scanUrlFn(tagId) : '';
  }
}
