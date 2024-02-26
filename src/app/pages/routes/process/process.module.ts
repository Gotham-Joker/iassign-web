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
