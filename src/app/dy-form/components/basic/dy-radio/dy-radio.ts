import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, Validators, FormsModule} from '@angular/forms';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NgIf, NgFor} from '@angular/common';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";

@Component({
    selector: 'dy-radio',
    templateUrl: './dy-radio.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NgIf, NzRadioModule, FormsModule, NgFor, NzDividerComponent, NzInputDirective, NzTabComponent, NzButtonComponent, NzSwitchComponent, NzInputNumberComponent, NzTabSetComponent]
})
export class DyRadio implements OnInit , DyComponent {
    @ViewChild('cfgTpl', {read: TemplateRef, static: true})
    templateRef;
    value: any = null;
    // 默认配置
    config: any = {
        type: 'radio',
        noColon: false,
        label: '单选',
        dyColSpan: 12,
        required: false,
        options: '0|Apple\n1|Android'
    };
    status: any;  // 校验结果
    opts: any[] = [];

    constructor() {
    }

    ngOnInit(): void {
        this.resolveOptions();
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


    resolveOptions() {
        const opts = [];
        if (this.config.options == null || this.config.options.trim() == '') {
            this.opts = opts;
            return;
        }
        const splits = this.config.options.split('\n');
        for (let i = 0; i < splits.length; i++) {
            const line = splits[i];
            if (line == null || line.trim() == '') { // 跳过空值
                continue;
            }
            const option = line.split('|');
            let value = option[0];
            let label = option[0];
            if (option.length > 1) {
                label = option[1];
            }
            opts.push({label: label, value: value});
        }
        this.opts = opts;
    }
}
