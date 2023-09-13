import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared.module";
import {Badge} from "./badge";


@NgModule({
    declarations: [Badge],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        Badge
    ]
})
export class BadgeModule {
}
