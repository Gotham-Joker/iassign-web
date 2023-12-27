import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, Validators} from "@angular/forms";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@Component({
    selector: 'dy-richtext',
    templateUrl: 'dy-richtext.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NzInputModule, FormsModule]
})

export class DyRichtext implements OnInit {
    config: any = {
        type: 'richtext',
        noColon: false,
        label: '富文本',
        dyColSpan: 24,
        required: false,
        placeholder: '',
        height: '65px', // 默认高度，预览时生效
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