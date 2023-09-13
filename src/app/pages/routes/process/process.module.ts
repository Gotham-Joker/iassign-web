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
import {ShotOverlayModule} from "../../../core/components/shot-overlay/shot-overlay.module";
import {RichTextModule} from "../../../core/components/rich-text/rich-text.module";
import {DyformsModule} from "../../../dy-form/dyforms.module";
import {MailSelectModule} from "../../../core/components/mail-select/mail-select.module";
import {ProcessAssign} from "./process-assign/process-assign";
import {DiffTimeModule} from "../../../core/diff-time/diff-time.module";
import {ProcessIndex} from "./process-index/process-index";
import {DagModule} from "../../../dag/dag.module";

const COMPONENTS = [
    ProcessManage, ProcessDesign, ProcessDetail, ProcessIndex,
    ProcessInstance, ProcessList, ProcessStart, TodoList,
    ProcessAssign
]

// 当前模块的路由
const routes: Route[] = [
    {path: '', redirectTo: 'process-list', pathMatch: 'full'},
    {path: 'process-manage', component: ProcessManage, data: {breadcrumb: '流程管理', reuse: true}},
    {path: 'process-list', component: ProcessList, data: {breadcrumb: '流程列表'}},
    {path: 'process-start', component: ProcessStart, data: {breadcrumb: '启动流程'}},
    {path: 'process-detail', component: ProcessDetail, data: {breadcrumb: '流程详情'}},
    {path: 'process-index', component: ProcessIndex, data: {breadcrumb: '查数', reuse: true}},
    {path: 'process-instance', component: ProcessInstance, data: {breadcrumb: '我的申请', reuse: true}},
    {path: 'todo-list', component: TodoList, data: {breadcrumb: '我的待办'}}
];

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        CommonModule,
        DagModule,
        SharedModule,
        DyformsModule,
        ShotOverlayModule,
        RichTextModule,
        MailSelectModule,
        DiffTimeModule,
        RouterModule.forChild(routes)
    ]
})
export class ProcessModule {
}
