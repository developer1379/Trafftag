import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class ModalComponent {
  modalService = inject(ModalService);

  onConfirm() {
    this.modalService.close(true);
  }

  onCancel() {
    this.modalService.close(false);
  }
}
