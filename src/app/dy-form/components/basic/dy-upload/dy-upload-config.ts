import {Component, OnInit} from '@angular/core';
import {DyUpload} from "./dy-upload";
import {DyConfigComponent} from "../../../interface/dy-form-interface";

@Component({
    selector: 'dy-upload-config',
    templateUrl: './dy-upload-config.html'
})
export class DyUploadConfig implements OnInit, DyConfigComponent<DyUpload> {
    ref: DyUpload;
    config: any;

    constructor() {
    }

    ngOnInit(): void {
        this.config = this.ref.config;
        if (this.config.fileList == null) {
            this.config.value = []; // 赋初始值
        }
    }

}
