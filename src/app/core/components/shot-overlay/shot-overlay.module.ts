import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShotOverlay} from "./shot-overlay";


/**
 * 弹窗2模块
 */
@NgModule({
    declarations: [ShotOverlay],
    imports: [
        CommonModule,
    ],
    exports: [
        ShotOverlay
    ]
})
export class ShotOverlayModule {
}
