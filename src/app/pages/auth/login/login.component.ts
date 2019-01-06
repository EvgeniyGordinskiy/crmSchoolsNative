import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// import { Kinvey } from 'kinvey-nativescript-sdk';
import { RouterExtensions } from "nativescript-angular/router";
import { NgZone } from "@angular/core";
import { Page } from "tns-core-modules/ui/page"
import { FormControl } from "@angular/forms";
import { AuthService } from "~/app/services/auth/auth.service";
import { AuthenticateResponseInterface } from "~/app/interfaces/authenticateResponse.interface";
import { AccountServiceResponseInterface } from "~/app/interfaces/accountServiceResponse.interface";
import {AuthenticateAction, AuthenticatedSuccessAction, UpdateAuthUser} from '~/app/store/auth/actions';
import * as AuthenticateReducer from '~/app/store/auth/reducers';
import { Store } from '@ngrx/store';
import { PermissionFacade } from "~/app/facades/permission/permissionFacade";
import { AuthFacade } from "~/app/facades/auth/authFacade";
import { AccountService } from "~/app/services/account/account.service";

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit{
    email: string = '';
    password: string = '';
    rememberMe = false;
    errors = {};
    @ViewChild('emailModel') emailModel: FormControl;
    @ViewChild('passwordModel') passwordModel: ElementRef;
    constructor(private _routerExtensions: RouterExtensions,
                private zone: NgZone,
                private authService: AuthService,
                private authFacade: AuthFacade,
                private store: Store<AuthenticateReducer.AuthState>,
                private accountService: AccountService,
                private page: Page) {
        this.page.actionBarHidden = true;
        this.page.backgroundSpanUnderStatusBar = true;
        this.page.className = "page-login-container";
        this.page.statusBarStyle = "dark";
        // this.signinForm = new FormGroup({
        //     'password': new FormControl(null, [Validators.required]),
        //     'email': new FormControl(null, [Validators.required, Validators.email])
        // });
    }
    ngOnInit() {
    }
    login() {
        console.log(this.validateEmail(this.email));
        if (!this.validateEmail(this.email)) {
            this.errors['email'] = true;
        } else if (this.password.length < 3) {
            this.errors['password'] = true;
        } else {
            console.log('clear');
            this.authService.login({email: this.email, password: this.password, rememberMe: this.rememberMe})
                .subscribe(
                    (resp: AuthenticateResponseInterface) => {
                        if (resp.data.token) {
                            this.authenticate(resp.data.token);
                        }
                    });        }
        console.log(this.errors);
        // if (Kinvey.User.getActiveUser() == null) {
        //     Kinvey.User.loginWithMIC()
        //         .then((user: Kinvey.User) => {
        //             this.navigateHome();
        //             console.log("user: " + JSON.stringify(user));
        //         })
        //         .catch((error: Kinvey.BaseError) => {
        //             alert("An error occurred. Check your Kinvey settings.");
        //             console.log("error: " + error);
        //         });
        // } else {
        //     this.navigateHome();
        // }
    }
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    private authenticate(token) {
        this.store.dispatch(new AuthenticateAction(token));
        this.accountService.getAccount().subscribe(
            (response: AccountServiceResponseInterface) => {
                const permissions = PermissionFacade.groupByModelName(response.data.permissions);
                const user =  this.authFacade.createUser(response, permissions);
                // console.log(user, 'authenticate login');
                AuthFacade.setUser(user);
                this.store.dispatch(new UpdateAuthUser(user));
                if (user.emailVerified === false && !user.parent_id) {
                    this.zone.run(() => {
                        this._routerExtensions.navigate(["auth/emailSent"], {
                            clearHistory: true,
                            animated: true,
                            transition: {
                                name: "slideTop",
                                duration: 350,
                                curve: "ease"
                            }
                        });
                    });
                } else if (
                    (!response.data.address ||
                        user.phoneNumberVerified === false ||
                        user.paymentSettingVerified === false ||
                        (user.role === 'student_group' && user.family.length === 0)) && !user.parent_id) {
                    console.log('setup not finished');
                    // AuthFacade.setToken(token, ResetPasswordComponent.resetTokenPrefix);
                    // this.router.navigate(['auth/setup']);
                } else {
                    this.store.dispatch(new AuthenticatedSuccessAction({authenticated: true, user: user}));
                    this.authFacade.checkAuthStatusAndRedirect(this);
                }
            },
            error => {
                console.log(error);
            }
        );
    }
    private navigateTo(page: string) {
        console.log(page);
        this.zone.run(() => {
            this._routerExtensions.navigate([page], {
                clearHistory: true,
                animated: true,
                transition: {
                    name: "slideTop",
                    duration: 350,
                    curve: "ease"
                }
            });
        });
    }
}
