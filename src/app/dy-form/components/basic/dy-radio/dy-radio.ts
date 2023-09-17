import {Component, OnInit} from '@angular/core';
import { FormControl, Validators, FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NgIf, NgFor } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
    selector: 'dy-radio',
    templateUrl: './dy-radio.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NgIf, NzRadioModule, FormsModule, NgFor]
})
export class DyRadio implements OnInit {

    value: any = null;
    // 默认配置
    config: any = {
        type: 'radio',
        noColon: false,
        label: '单选',
        dyColSpan: 12,
        required: false,
        options: 'Apple\nAndroid'
    };
    status: any;  // 校验结果


    constructor() {
    }

    ngOnInit(): void {
    }

    validate() {
        // 添加校验函数
        const validators = [];
        if (this.config.required) {
            const requiredFn = (ctl: any) => {
                return Validators.required(ctl);
            };
            validators.push(requiredFn);
        }
        // 开始校验
        const control = new FormControl(this.value, validators);
        if (control.invalid) {
            this.status = 'error';
        } else {
            this.status = null;
        }
    }


}
