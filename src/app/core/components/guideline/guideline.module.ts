import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Guideline} from "./guideline";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {OverlayModule} from "@angular/cdk/overlay";


/**
 * 操作指引模块
 */
@NgModule({
    declarations: [Guideline],
    imports: [
        CommonModule,
        NzPopconfirmModule,
        OverlayModule
    ],
    exports: [
        Guideline
    ]
})
export class GuidelineModule {
}
