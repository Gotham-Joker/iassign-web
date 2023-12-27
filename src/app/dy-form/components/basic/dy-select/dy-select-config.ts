import {Component, OnInit} from '@angular/core';
import {DySelect} from "./dy-select";
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@Component({
    selector: 'dy-select-config',
    templateUrl: './dy-select-config.html',
    standalone: true,
    imports: [NzTabsModule, NzGridModule, NzFormModule, NzInputModule, FormsModule, NzInputNumberModule, NzSelectModule, NzSwitchModule, NzButtonModule, NzWaveModule, NzDividerModule, NzCheckboxModule]
})
export class DySelectConfig implements OnInit, DyConfigComponent<DySelect> {
    ref: DySelect;
    config: any;

    constructor() {
    }

    ngOnInit(): void {
        this.config = this.ref.config;
    }

    optionChange(ev: any) {
        this.ref.resolveOptions();
    }

    /**
     * 修改模式
     * @param $event
     */
    changeMode($event: any) {
        if ($event == 'multiple') {
            if (this.ref.config.value == '') {
                this.ref.config.value = [];
            }
        } else {
            if (Array.isArray(this.ref.config.value) && this.ref.config.value.length == 0) {
                this.ref.config.value = '';
            }
        }
    }
}
