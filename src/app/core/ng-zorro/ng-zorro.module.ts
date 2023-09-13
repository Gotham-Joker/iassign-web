import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";


import {NzInputModule} from 'ng-zorro-antd/input';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzMessageModule} from "ng-zorro-antd/message";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzTransferModule} from "ng-zorro-antd/transfer";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzListModule} from "ng-zorro-antd/list";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzSegmentedModule} from "ng-zorro-antd/segmented";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzTimelineModule} from "ng-zorro-antd/timeline";

const MODULES = [
    NzFormModule, NzInputModule, NzInputNumberModule, NzButtonModule, NzSpinModule, NzAvatarModule,
    NzMenuModule, NzBreadCrumbModule, NzDropDownModule, NzBadgeModule, NzCardModule, NzTabsModule,
    NzTableModule, NzTagModule, NzDividerModule, NzMessageModule, NzSelectModule, NzPopconfirmModule,
    NzModalModule, NzGridModule, NzRadioModule, NzTransferModule, NzSwitchModule, NzListModule,
    NzDatePickerModule, NzPopoverModule, NzProgressModule, NzEmptyModule, NzStatisticModule, NzToolTipModule,
    NzSegmentedModule, NzUploadModule, NzDrawerModule, NzCheckboxModule, NzLayoutModule,
    NzDescriptionsModule, NzStepsModule, NzResultModule, NzTimelineModule
]

/**
 * 导入ng-zorro组件
 */
@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [ // 既然是公用模块，那就需要导出给其他模块使用
        ...MODULES
    ]
})
export class NgZorroModule {
}
