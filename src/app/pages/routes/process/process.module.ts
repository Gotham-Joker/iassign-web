import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {ProcessManage} from "./process-manage/process-manage";
import {SharedModule} from "../../../core/shared.module";
import {ProcessDesign} from "./process-design/process-design";
import {ProcessDetail} from "./process-detail/process-detail";
import {ProcessInstance} from "./process-instance/process-instance";
import {ProcessList} from "./process-list/process-list";
import {ProcessStart} from "./process-start/process-start";
import {TodoList} from "./todo-list/todo-list";
import {DyformsModule} from "../../../dy-form/dyforms.module";
import {ProcessAssign} from "./process-assign/process-assign";
import {ProcessIndex} from "./process-index/process-index";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {RoleUserList} from "./role-user-list/role-user-list";
import {DagModule} from "../../../dag/dag.module";
import {CheckedList} from "./checked-list/checked-list";
import {ProcessConfig} from "./process-config/process-config";

const COMPONENTS = [
    ProcessManage, ProcessDesign, ProcessDetail, ProcessIndex,
    ProcessInstance, ProcessList, ProcessStart, TodoList,
    ProcessAssign, RoleUserList, CheckedList
]

// 当前模块的路由
const routes: Route[] = [
    {path: '', redirectTo: 'process-list', pathMatch: 'full'},
    {path: 'process-manage', component: ProcessManage, data: {breadcrumb: '流程管理', reuse: true}},
    {path: 'process-list', component: ProcessList, data: {breadcrumb: '流程列表'}},
    {path: 'process-start', component: ProcessStart, data: {breadcrumb: '启动流程'}},
    {path: 'process-detail', component: ProcessDetail, data: {breadcrumb: '流程详情'}},
    {path: 'process-config', component: ProcessConfig, data: {breadcrumb: '配置'}},
    {path: 'process-index', component: ProcessIndex, data: {breadcrumb: '查数', reuse: true}},
    {path: 'process-instance', component: ProcessInstance, data: {breadcrumb: '我的申请', reuse: true}},
    {path: 'todo-list', component: TodoList, data: {breadcrumb: '待办事项', reuse: true}},
    {path: 'checked-list', component: CheckedList, data: {breadcrumb: '已办事项', reuse: true}}
];

@NgModule({
    imports: [
        CommonModule,
        DagModule,
        SharedModule,
        DyformsModule,
        RouterModule.forChild(routes),
        NzPaginationModule,
        ...COMPONENTS
    ]
})
export class ProcessModule {
}
