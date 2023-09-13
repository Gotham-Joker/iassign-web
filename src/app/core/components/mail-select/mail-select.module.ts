import {NgModule} from '@angular/core';

import {MailSelect} from './mail-select';
import {CommonModule} from "@angular/common";
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {CdkConnectedOverlay, CdkOverlayOrigin} from "@angular/cdk/overlay";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {FormsModule} from "@angular/forms";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzAvatarModule} from "ng-zorro-antd/avatar";

@NgModule({
    imports: [CommonModule, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf,
        CdkConnectedOverlay, CdkOverlayOrigin, NzInputModule, NzIconModule, NzButtonModule,
        FormsModule, NzEmptyModule, NzAvatarModule
    ],
    exports: [MailSelect],
    declarations: [MailSelect]
})
export class MailSelectModule {
}
