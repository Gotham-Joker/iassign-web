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
