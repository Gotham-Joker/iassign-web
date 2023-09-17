import {Component, OnInit} from '@angular/core';
import { FormControl, Validators, FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgIf, NgFor } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
    selector: 'dy-select',
    templateUrl: './dy-select.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NgIf, NzSelectModule, FormsModule, NgFor]
})
export class DySelect implements OnInit {
    config: any = {
        type: 'select',
        label: '选择',
        dyColSpan:12,
        options: 'Alex\nJudith',
        value: ''
    };
    status: any;

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
        const control = new FormControl(this.config.value, validators);
        if (control.invalid) {
            this.status = 'error';
        } else {
            this.status = null;
        }
    }

}
