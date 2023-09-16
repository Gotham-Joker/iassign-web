import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'dy-input',
    templateUrl: './dy-input.html',
    styles: [':host{display: block;}']
})
export class DyInput implements OnInit {

    // 默认配置
    config: any = {
        type: 'input',
        noColon: false,
        label: '标签',
        required: false,
        placeholder: '',
        dyColSpan: 12,
        value: ''
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
        validators.push(Validators.pattern(this.config.regex));
        // 开始校验
        const control = new FormControl(this.config.value, validators);
        if (control.invalid) {
            this.status = 'error';
        } else {
            this.status = null;
        }
    }


}
