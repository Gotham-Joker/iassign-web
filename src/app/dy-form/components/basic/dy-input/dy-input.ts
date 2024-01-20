import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, Validators, FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NgIf} from '@angular/common';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";

@Component({
    selector: 'dy-input',
    templateUrl: './dy-input.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NgIf, NzInputModule, FormsModule, NzDividerComponent, NzTabComponent, NzButtonComponent, NzSwitchComponent, NzInputNumberComponent, NzTabSetComponent]
})
export class DyInput implements OnInit, DyComponent {
    @ViewChild('cfgTpl', {read: TemplateRef, static: true})
    templateRef;

    // 默认配置
    config: any = {
        type: 'input',
        noColon: false,
        label: '标签',
        required: false,
        placeholder: '',
        dyColSpan: 12,
        cascade: '', // 联动条件，表达式为true时控件会被隐藏
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
