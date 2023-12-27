import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {User} from "./user/user";
import {Route, RouterModule} from "@angular/router";
import {SharedModule} from "../../../core/shared.module";
import {UserPreview} from "./user/user-preview/user-preview";
import {Permission} from "./permission/permission";
import {Menu} from "./menu/menu";
import {Role} from "./role/role";
import {Transfer} from "./transfer/transfer";
import {Dept} from "./dept/dept";
import {Message} from "./message/message";
import {RoleUser} from "./role-user/role-user";

// 当前模块需要引用其他公共模块(form表单,ng-zorro第三方组件库,图标等)
const MODULES = [SharedModule];
// 当前模块的组件
const COMPONENTS = [
    User, UserPreview, Role, RoleUser, Menu, Permission, Dept, Transfer, Message
];
// 当前模块的路由
const routes: Route[] = [
    {path: '', redirectTo: 'user', pathMatch: 'full'},
    {path: 'message', component: Message, data: {breadcrumb: '系统消息'}},
    {path: 'user', component: User, data: {breadcrumb: '用户管理', reuse: true}},
    {path: 'user/:id', component: UserPreview, data: {breadcrumb: '用户预览'}},
    {path: 'dept', component: Dept, data: {breadcrumb: '部门管理'}},
    {path: 'role', component: Role, data: {breadcrumb: '角色管理'}},
    {path: 'role-user', component: RoleUser, data: {breadcrumb: '角色-用户'}},
    {path: 'menu', component: Menu, data: {breadcrumb: '菜单管理'}},
    {path: 'permission', component: Permission, data: {breadcrumb: '权限管理'}}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ...MODULES,
        ...COMPONENTS
    ]
})
export class SystemModule {
}
