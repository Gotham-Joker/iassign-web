import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzDividerComponent} from "ng-zorro-antd/divider";

@Component({
    selector: 'dy-checkbox',
    templateUrl: './dy-checkbox.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [
        NzFormItemComponent,
        NzTabSetComponent,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzCheckboxComponent, NzRowDirective, NzColDirective, NzTabComponent, NzInputDirective, FormsModule, NzInputNumberComponent, NzSwitchComponent, NzButtonComponent, NzDividerComponent
    ]
})
export class DyCheckbox implements OnInit, DyComponent {
    @ViewChild('cfgTpl', {static: true, read: TemplateRef})
    templateRef;

    value: any = [];
    // 默认配置
    config: any = {
        type: 'checkbox',
        noColon: false,
        label: '多选',
        required: false,
        dyColSpan: 12,
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
