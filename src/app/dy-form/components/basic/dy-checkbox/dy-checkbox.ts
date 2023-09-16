import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'dy-checkbox',
    templateUrl: './dy-checkbox.html',
    styles: [':host{display: block;}']
})
export class DyCheckbox implements OnInit {

    value: any = [];
    // 默认配置
    config: any = {
        type: 'checkbox',
        noColon: false,
        label: '多选',
        required: false,
        dyColSpan: 12,
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
                if (ctl.value != null && ctl.value.length > 0) {
                    return null;
                }
                return {'required': true};
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


    isCheck(item: string) { // 判断当前的值是否选中
        if (this.value != null && this.value.length > 0) {
            return this.value.indexOf(item) > -1;
        }
        return false;
    }

    change(ev: any, item: any) {
        if (ev) {
            if (this.value != null) {
                this.value.push(item);
            } else {
                this.value = [item];
            }
        } else {
            if (this.value != null) {
                const idx = this.value.indexOf(item);
                this.value.splice(idx, 1);
                if (this.value.length === 0) {
                    this.value = null;
                }
            }
        }
    }
}
