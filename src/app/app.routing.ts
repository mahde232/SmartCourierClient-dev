import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { CourierComponent } from './courier/index';
import { DeliveryComponent } from './delivery/index';
import { RegionComponent } from './region/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'courier', component: CourierComponent },
    { path: 'courier/:user', component: CourierComponent, pathMatch: 'full' },
    { path: 'delivery', component: DeliveryComponent },
    { path: 'delivery/:delivery', component: DeliveryComponent, pathMatch: 'full' },
    { path: 'region', component: RegionComponent },
    { path: 'region/:region', component: RegionComponent, pathMatch: 'full' },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
