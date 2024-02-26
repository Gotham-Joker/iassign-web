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
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormsDesigner} from "./forms-designer";
import {DyRow} from "./components/layout/dy-row/dy-row";
import {DySelect} from "./components/basic/dy-select/dy-select";
import {DyInput} from "./components/basic/dy-input/dy-input";
import {DyRadio} from "./components/basic/dy-radio/dy-radio";
import {DyCheckbox} from "./components/basic/dy-checkbox/dy-checkbox";
import {DyDatepicker} from "./components/basic/dy-datepicker/dy-datepicker";
import {DyForm} from "./dy-form";
import {DyTextarea} from "./components/basic/dy-textarea/dy-textarea";
import {DyUpload} from "./components/basic/dy-upload/dy-upload";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
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
import {NzIconModule} from "ng-zorro-antd/icon";

import {
    DeleteOutline,
    SaveOutline,
    UploadOutline,
    CaretRightOutline,
    QuestionCircleOutline
} from '@ant-design/icons-angular/icons';
import {DyInputNumber} from "./components/basic/dy-input-number/dy-input-number";
import {DyColDirective} from "./components/layout/dy-col/dy-col.directive";

const icons: any[] = [
    DeleteOutline,
    SaveOutline,
    UploadOutline,
    CaretRightOutline,
    QuestionCircleOutline
];

const MODULES = [
    NzFormModule, NzInputModule, NzInputNumberModule, NzButtonModule, NzSpinModule, NzAvatarModule,
    NzMenuModule, NzBreadCrumbModule, NzDropDownModule, NzBadgeModule, NzCardModule, NzTabsModule,
    NzTableModule, NzTagModule, NzDividerModule, NzMessageModule, NzSelectModule, NzPopconfirmModule,
    NzModalModule, NzGridModule, NzRadioModule, NzTransferModule, NzSwitchModule, NzListModule,
    NzDatePickerModule, NzPopoverModule, NzProgressModule, NzEmptyModule, NzStatisticModule, NzToolTipModule,
    NzSegmentedModule, NzUploadModule, NzDrawerModule, NzCheckboxModule, NzLayoutModule,
    NzDescriptionsModule, NzStepsModule, NzResultModule, NzTimelineModule
]

const COMPONENTS = [DyForm, FormsDesigner, DyRow, DyInput, DyInputNumber,
    DyTextarea, DySelect, DyRadio, DyColDirective, DyCheckbox, DyDatepicker, DyUpload];

@NgModule({
    imports: [
        CommonModule,
        ...MODULES,
        DragDropModule,
        FormsModule,
        ReactiveFormsModule,
        NzIconModule.forChild(icons),
        ...COMPONENTS
    ],
    exports: [...COMPONENTS, NzIconModule]
})
export class DyformsModule {
}
