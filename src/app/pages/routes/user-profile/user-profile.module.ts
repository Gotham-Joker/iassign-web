import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfile} from "./user-profile";
import {SharedModule} from "../../../core/shared.module";
import {Route, RouterModule} from "@angular/router";

const routes: Route[] = [
    {
        path: '', redirectTo: 'profile', pathMatch: 'full'
    },
    {
        path: 'profile',
        component: UserProfile,
        data: {breadcrumb: 'profile'}
    }
]

@NgModule({
    declarations: [UserProfile],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class UserProfileModule {
}
