import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgZorroModule} from "./ng-zorro/ng-zorro.module";
import {IconsProviderModule} from "./ng-zorro/icons-provider.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BackwardModule} from "./components/backward/backward.module";
import {DictionaryModule} from "./dictionary/dictionary.module";
import {AclDirective} from "./acl/acl.directive";

const MODULES = [
    CommonModule, FormsModule, ReactiveFormsModule, NgZorroModule, IconsProviderModule, BackwardModule,DictionaryModule
];

/**
 * 共享模块，全局共享的东西可以放道这里声明
 */
@NgModule({
    declarations: [
        AclDirective
    ],
    imports: [
        ...MODULES
    ],
    exports: [
        ...MODULES,
        AclDirective
    ]
})
export class SharedModule {
}
