import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NZ_ICONS, NzIconModule} from "ng-zorro-antd/icon";
import {
    UserOutline,
    LockOutline
} from '@ant-design/icons-angular/icons';
import {ReactiveFormsModule} from "@angular/forms";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

// 单独引入图标
const icons = [
    UserOutline, LockOutline
];
// 因为登录模块比较特殊，为了避免登录模块臃肿，所以按需引入它需要的组件，而不是直接引入SharedModule
const MODULES = [
    ReactiveFormsModule, NzInputModule, NzFormModule, NzSpinModule, NzIconModule, NzCheckboxModule
];
// 当前模块的组件
const COMPONENTS = [LoginComponent];
// 当前模块的路由
const routes: Routes = [
    {path: 'login', component: LoginComponent},
];

/**
 *
 */
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // SharedModule,
        ...MODULES,
        ...COMPONENTS
    ],
    providers: [
        { provide: NZ_ICONS, useValue: icons }
    ]
})
export class PassportModule {
}
