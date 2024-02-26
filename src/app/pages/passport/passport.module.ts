/*
 * MIT License
 *
 * Copyright (c) 2024 Hongtao Liu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

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
