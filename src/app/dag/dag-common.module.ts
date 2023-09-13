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
