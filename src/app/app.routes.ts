import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Portal } from './components/portal/portal';
import { Admin } from './components/admin/admin';
import { Scan } from './components/scan/scan';
import { Features } from './components/features/features';
import { Pricing } from './components/pricing/pricing';
import { Faq } from './components/faq/faq';

export const routes: Routes = [
  { path: '', component: Home, title: 'TRAFFTAG | Protect Your Vehicle Anonymously with QR Decals' },
  { path: 'features', component: Features, title: 'Features & Benefits | TRAFFTAG QR Vehicle Protection' },
  { path: 'pricing', component: Pricing, title: 'Pricing & Protection Plans | TRAFFTAG Safety Services' },
  { path: 'faq', component: Faq, title: 'Frequently Asked Questions | TRAFFTAG Help Center' },
  { path: 'login', component: Login, title: 'Sign In | TRAFFTAG Customer Portal' },
  { path: 'register', component: Register, title: 'Create Account | TRAFFTAG Safety Registry' },
  { path: 'portal', redirectTo: 'portal/dashboard', pathMatch: 'full' },
  { path: 'portal/:subpage', component: Portal, title: 'Customer Dashboard | TRAFFTAG Portal' },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/:subpage', component: Admin, title: 'Administrator Control Panel | TRAFFTAG Console' },
  { path: 'scan', component: Scan, title: 'Decal Scanning Gateway | TRAFFTAG Alert' },
  { path: 'scan/:tagId', component: Scan, title: 'Scan Decal Tag | TRAFFTAG Anonymous Notification' },
  { path: '**', redirectTo: '' }
];

