import { isDevMode } from '@angular/core';

export const API_BASE_URL = isDevMode()
  ? '' // Bypasses CORS locally via dev-server proxy
  : 'https://trafftagapi.runasp.net'; // Production backend URL
