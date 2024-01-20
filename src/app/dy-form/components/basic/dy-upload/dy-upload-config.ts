import {Component, OnInit} from '@angular/core';
import {DyUpload} from "./dy-upload";
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";

@Component({
    selector: 'dy-upload-config',
    templateUrl: './dy-upload-config.html',
    standalone: true,
    imports: [NzTabsModule, NzGridModule, NzFormModule, NzInputModule, FormsModule, NzInputNumberModule, NzSwitchModule, NzButtonModule, NzWaveModule, NzDescriptionsModule, NzDividerComponent, NzSelectComponent, NzOptionComponent]
})
export class DyUploadConfig implements OnInit, DyConfigComponent<DyUpload> {
    ref: DyUpload;
    config: any;

    constructor() {
    }

    ngOnInit(): void {
        this.config = this.ref.config;
    }

}
