import {NgModule} from '@angular/core';
import {Backward} from "./backward";
import {CommonModule} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {IconDefinition} from '@ant-design/icons-angular';

import {
    BackwardOutline
} from '@ant-design/icons-angular/icons';

const ICONS: IconDefinition[] = [BackwardOutline];

@NgModule({
    imports: [
        CommonModule,
        NzButtonModule,
        NzIconModule.forChild(ICONS),
        Backward
    ],
    exports: [
        Backward
    ]
})
export class BackwardModule {
}
