import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AclDirective} from "./acl.directive";


@NgModule({
    declarations: [AclDirective],
    imports: [
        CommonModule
    ],
    exports: [AclDirective]
})
export class AclModule {
}
