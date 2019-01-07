import { Component, NgZone } from "@angular/core";
import { User } from "../app/models/user";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AuthFacade } from "../app/facades/auth/authFacade";
import { RefreshAuthState, SignOut, UpdateAuthUser } from "./store/auth/actions";
import { PermissionFacade } from "../app/facades/permission/permissionFacade";
import { StopSpinner } from "./store/spinner/actions";
import * as SpinnerReducer from './store/spinner/reducers';
import * as AuthenticateReducer from './store/auth/reducers';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { TNSFontIconService } from "nativescript-ng2-fonticon";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent {
    user: User;
    constructor(
        private router: Router,
        private authStore: Store<AuthenticateReducer.AuthState>,
        private spinnerStore: Store<SpinnerReducer.SpinnerState>,
        private authFacade: AuthFacade,
        private _routerExtensions: RouterExtensions,
        private zone: NgZone,
        private page: Page,
    private fonticon: TNSFontIconService
    ) {
        this.page.actionBarHidden = true;
        this.page.backgroundSpanUnderStatusBar = true;
        this.page.className = "page-app-container";
        this.page.statusBarStyle = "dark";
        this.authStore.subscribe(
            (val) => {
                const auth = val.auth;
                if (auth && auth.user) {
                    this.user = auth.user;
                }
            }
        );
        this.authStore.dispatch(new RefreshAuthState());
        this.authFacade.checkAuthStatusAndRedirect(this);
    }

    beforeRoute() {
        console.log('beforeRoute', this.authFacade.pageNeedAuth(), this.user);
        if (this.authFacade.pageNeedAuth()) {
            this.authFacade.checkAuthStatusAndRedirect(this);
            // if (!this.user.notAdmin && this.user.role !== 'super_admin') {
            //     if (!this.user.schools || (!this.user.schools.length && this.user.hasProgram === false)) {
            //         this.router.navigate(['/auth/setup']);
            //     } else if (!this.user.activeSchool && this.user.schools.length > 0) {
            //         this.user.activeSchool = this.user.schools[0]['id'];
            //         this.authStore.dispatch(new UpdateAuthUser(this.user));
            //     }
            // }
            if (!PermissionFacade.checkPermissionsToAccessPage(this.router.url.split('?')[0], this.user)) {
                if (AuthFacade.getAuthStatus()) {
                    this.router.navigate(['/layout/dashboard']);
                } else {
                    this.router.navigate(['/login']);
                }
            }
        }

        if (this.router.url === '/login' || this.router.url === '/register') {
            this.authStore.dispatch(new SignOut(this.authFacade, false));
        }

        this.spinnerStore.dispatch(new StopSpinner());
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
