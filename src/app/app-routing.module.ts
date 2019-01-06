import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { UserComponent } from "~/app/layouts/user/user.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", loadChildren: "~/app/pages/auth/login/login.module#LoginModule" },
    // {
    //     path: '',
    //     component: UserComponent,
    //     children: [
    //         {
    //             path: 'dashboard',
    //             loadChildren: '~/app/pages/layout/dashboard/dashboard.module#DashboardModule'
    //         },
    //     ]
    // },
    // { path: "home", loadChildren: "~/app/home/home.module#HomeModule"},

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
