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


import {
  ZoomInOutline, ZoomOutOutline, OneToOneOutline, ColumnWidthOutline, SaveOutline, DeleteOutline,
  NodeIndexOutline
} from '@ant-design/icons-angular/icons';
import {IconDefinition} from "@ant-design/icons-angular";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzMessageModule} from "ng-zorro-antd/message";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

const icons: IconDefinition[] = [
  ZoomInOutline, ZoomOutOutline, OneToOneOutline, ColumnWidthOutline, SaveOutline, DeleteOutline,
  NodeIndexOutline
];

const MODULES = [
  CommonModule,
  // 依赖ng-zorro模块
  NzFormModule, NzInputModule, NzInputNumberModule, NzButtonModule, NzSpinModule,
  NzCardModule, NzTabsModule, NzDividerModule, NzMessageModule, NzSelectModule,
  NzModalModule, NzGridModule, NzRadioModule, NzPopoverModule, NzEmptyModule, NzToolTipModule,
  NzDrawerModule, NzCheckboxModule
];

/**
 * 共享模块，全局共享的东西可以放道这里声明
 */
@NgModule({
  declarations: [],
  imports: [
    ...MODULES, NzIconModule.forChild(icons)
  ],
  exports: [
    ...MODULES, NzIconModule
  ]
})
export class DagCommonModule {
}
