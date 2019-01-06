import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { FormsModule } from "@angular/forms";
import { AuthFacade } from "~/app/facades/auth/authFacade";
import { AccountService } from "~/app/services/account/account.service";
import { AuthService } from "~/app/services/auth/auth.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        LoginRoutingModule,
        FormsModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        LoginComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        AuthService,
        AccountService
    ]
})
export class LoginModule { }
