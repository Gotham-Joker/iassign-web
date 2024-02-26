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
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../../core/shared.module";
import {Route, RouterModule} from "@angular/router";
import {FormManage} from "./form-manage/form-manage";
import {FormPreview} from "./form-preview/form-preview";
import {FormDesign} from "./form-design/form-design";
import {DyformsModule} from "../../../dy-form/dyforms.module";

// 当前模块需要引用其他公共模块(form表单,ng-zorro第三方组件库,图标等)
// 表单设计当然需要动态表单模块(自研的Dyforms)
const MODULES = [SharedModule, DyformsModule];
// 当前模块的组件
const COMPONENTS = [FormManage, FormPreview, FormDesign];
// 当前模块的路由
const routes: Route[] = [
    {path: '', redirectTo: 'form-manage', pathMatch: 'full'},
    {path: 'form-manage', component: FormManage, data: {breadcrumb: '表单管理', reuse: true}},
    {path: 'form-preview', component: FormPreview, data: {breadcrumb: '表单预览'}}
];

/**
 * 表单设计模块
 */
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ...MODULES,
        ...COMPONENTS
    ]
})
export class FormDesignerModule {
}
