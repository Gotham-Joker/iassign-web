import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {Layout} from "./layout";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {Header} from "./header/header";
import {Sidebar} from "./sidebar/sidebar";
import {SharedModule} from "../../core/shared.module";
import {KeywordSearch} from "./keyword-search/keyword-search";
import {DiffTimeModule} from "../../core/diff-time/diff-time.module";
import {SysMessageService} from "./sys-message.service";

// 按需引入其他模块
const MODULES = [NzLayoutModule, SharedModule, DiffTimeModule];
// 当前模块的组件
const COMPONENTS = [Layout, Sidebar, Header, KeywordSearch];

/**
 * 布局模块
 */
@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        CommonModule,
        RouterModule,
        ...MODULES
    ],
    exports: [
        ...COMPONENTS
    ],
    providers: [SysMessageService]
})
export class LayoutModule {
}
