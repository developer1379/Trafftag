import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-tab.component.html',
  styleUrl: './support-tab.component.css'
})
export class SupportTabComponent {
  @Input() supportTickets: any[] = [];
  @Output() openSubmitTicket = new EventEmitter<void>();
}
