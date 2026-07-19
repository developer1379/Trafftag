import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  id?: string;
  type: 'confirm' | 'alert' | 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  activeModal = signal<ModalConfig | null>(null);

  /**
   * Show a confirmation modal (Confirm / Cancel)
   */
  confirm(options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }): Promise<boolean> {
    return new Promise((resolve) => {
      let icon = 'fa-triangle-exclamation';
      if (options.type === 'danger') icon = 'fa-trash-can';
      if (options.type === 'info') icon = 'fa-circle-info';

      this.activeModal.set({
        type: options.type === 'danger' ? 'error' : (options.type || 'warning'),
        title: options.title || (options.type === 'danger' ? 'Confirm Deletion' : 'Please Confirm'),
        message: options.message,
        confirmText: options.confirmText || (options.type === 'danger' ? 'Delete' : 'Confirm'),
        cancelText: options.cancelText || 'Cancel',
        icon,
        resolve
      });
    });
  }

  /**
   * Show an alert notification modal (OK button only)
   */
  alert(options: {
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      let icon = 'fa-circle-info';
      if (options.type === 'success') icon = 'fa-circle-check';
      if (options.type === 'error') icon = 'fa-circle-xmark';
      if (options.type === 'warning') icon = 'fa-triangle-exclamation';

      this.activeModal.set({
        type: options.type || 'info',
        title: options.title || (options.type === 'error' ? 'Notice' : 'Information'),
        message: options.message,
        confirmText: options.confirmText || 'Understand & Close',
        icon,
        resolve
      });
    });
  }

  /**
   * Helper shortcut for success alerts
   */
  showSuccess(title: string, message: string): Promise<boolean> {
    return this.alert({ title, message, type: 'success' });
  }

  /**
   * Helper shortcut for error alerts
   */
  showError(title: string, message: string): Promise<boolean> {
    return this.alert({ title, message, type: 'error' });
  }

  /**
   * Helper shortcut for warning alerts
   */
  showWarning(title: string, message: string): Promise<boolean> {
    return this.alert({ title, message, type: 'warning' });
  }

  close(result: boolean) {
    const current = this.activeModal();
    if (current && current.resolve) {
      current.resolve(result);
    }
    this.activeModal.set(null);
  }
}
