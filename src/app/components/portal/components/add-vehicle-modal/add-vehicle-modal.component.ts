import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vehicle-modal.component.html',
  styleUrl: './add-vehicle-modal.component.css'
})
export class AddVehicleModalComponent {
  @Input() show = false;
  @Input() makes: any[] = [];
  @Input() models: any[] = [];
  @Input() selectedMakeId = '';
  @Input() selectedModelId = '';
  @Input() newYear = 2025;
  @Input() newPlate = '';
  @Input() newColor = '';
  @Input() newStateProvince = 'California';
  @Input() newVin = '';
  @Input() newDriverName = '';
  @Input() colorPresets: any[] = [];

  @Output() selectedMakeIdChange = new EventEmitter<string>();
  @Output() selectedModelIdChange = new EventEmitter<string>();
  @Output() newYearChange = new EventEmitter<number>();
  @Output() newPlateChange = new EventEmitter<string>();
  @Output() newColorChange = new EventEmitter<string>();
  @Output() newStateProvinceChange = new EventEmitter<string>();
  @Output() newVinChange = new EventEmitter<string>();
  @Output() newDriverNameChange = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onMakeChange(makeId: string) {
    this.selectedMakeIdChange.emit(makeId);
    this.selectedModelIdChange.emit('');
  }
}
