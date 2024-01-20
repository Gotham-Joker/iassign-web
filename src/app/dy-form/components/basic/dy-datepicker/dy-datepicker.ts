import {Component, OnInit, TemplateRef, ViewChild,} from '@angular/core';
import {FormControl, Validators, FormsModule} from '@angular/forms';
import {formatDate} from '@angular/common';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
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
    selector: 'dy-datepicker',
    templateUrl: './dy-datepicker.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NzDatePickerModule, FormsModule, NzDividerComponent, NzInputDirective, NzTabComponent, NzButtonComponent, NzSwitchComponent, NzInputNumberComponent, NzTabSetComponent]
})
export class DyDatepicker implements OnInit , DyComponent {
    @ViewChild('cfgTpl', {read: TemplateRef, static: true})
    templateRef;
    value: any = null;
    // 默认配置
    config: any = {
        type: 'datepicker',
        noColon: false,
        label: '日期',
        dyColSpan: 12,
        val: null,
        required: false,
        showTime: false
    };
    date: any = null;
    status: any;  // 校验结果
    dateFormat = 'yyyy-MM-dd';
    dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';


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
        const control = new FormControl(this.value, validators);
        if (control.invalid) {
            this.status = 'error';
        } else {
            this.status = null;
        }
    }

    change($event: any) {
        if ($event == null) {
            this.value = null;
            return;
        }
        if (this.config.showTime) {
            this.value = formatDate(this.date, this.dateTimeFormat, 'zh_CN');
        } else {
            this.value = formatDate(this.date, this.dateFormat, 'zh_CN');
        }
    }

}
