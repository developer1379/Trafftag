import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './components/modal/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('qr-taxi');

  ngOnInit() {
    // Session initialisation
  }
}
