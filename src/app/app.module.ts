import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import {reducers} from './store/app.reducers';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./services/interceptors/auth.interceptor";
import { MainInterceptor } from "./services/interceptors/main.interceptor";
import { MetaReducer, Store, StoreModule } from "@ngrx/store";
import { AuthFacade } from "~/app/facades/auth/authFacade";
import { NativescriptBottomNavigationModule } from "nativescript-bottom-navigation/angular";
import { UserComponent } from './layouts/user/user.component';
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { FormsModule } from "@angular/forms";
import { TNSFontIconModule } from "nativescript-ng2-fonticon";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        FormsModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        NativescriptBottomNavigationModule,
        StoreModule.forRoot(reducers),
        TNSFontIconModule.forRoot({
            'mdi': 'material-design-icons.css'
        })
    ],
    declarations: [
        AppComponent,
        UserComponent,
    ],
    providers: [
        AuthFacade,
        { provide: HTTP_INTERCEPTORS, useClass: MainInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
