import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { JwtInterceptor } from './_helpers/index';
import { AlertService, AuthenticationService, UserService, CourierService, DeliveryService, SalaryService, RegionService} from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { CourierComponent } from './courier/index';
import { DeliveryComponent } from './delivery/index';
import { RegionComponent } from './region/index';
import { AutoCompleteModule } from 'ng5-auto-complete';
import {AgmCoreModule } from '@agm/core';
@NgModule({
    imports: [
        AgmCoreModule.forRoot({
          apiKey:'insert-key-here',
          libraries: ['places']
        }),
        FormsModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        CourierComponent,
        DeliveryComponent,
        RegionComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        CourierService,
        DeliveryService,
        RegionService,
        SalaryService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
