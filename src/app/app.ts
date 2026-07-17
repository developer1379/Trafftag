import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('qr-taxi');

  ngOnInit() {
    // Seed the user's provided token into local storage for seamless testing
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMCIsImVtYWlsIjoiYXJ2aW5kdmVybWE2MzA2MzVAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IkFSVklORCIsImZhbWlseV9uYW1lIjoiVkVSTUEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDdXN0b21lciIsIm5iZiI6MTc4NDI4NTEyMywiZXhwIjoxNzg0Mjg2MDIzLCJpc3MiOiJUcmFmZlRhZyIsImF1ZCI6IlRyYWZmVGFnVXNlcnMifQ.VvJBId6aTfs-TC_Sk5h5_jsPRGwzlmSHwa-eenKcfMw';
    localStorage.setItem('accessToken', userToken);
    localStorage.setItem('otpEmail', 'arvindverma630635@gmail.com');
  }
}
