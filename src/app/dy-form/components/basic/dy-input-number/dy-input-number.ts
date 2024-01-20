import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, Validators, FormsModule} from '@angular/forms';
import {formatNumber} from "@angular/common";
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzSwitchComponent} from "ng-zorro-antd/switch";

@Component({
    selector: 'dy-input-number',
    templateUrl: './dy-input-number.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NzInputNumberModule, FormsModule, NzDividerComponent, NzTabComponent, NzButtonComponent, NzInputDirective, NzSwitchComponent, NzTabSetComponent]
})
export class DyInputNumber implements OnInit , DyComponent {
    @ViewChild('cfgTpl', {read: TemplateRef, static: true})
    templateRef;
    // 默认配置
    config: any = {
        type: 'number',
        noColon: false,
        label: '数字',
        required: false,
        placeholder: '',
        min: -999999999999999,
        max: 999999999999999,
        value: 0
    };
    status: any;  // 校验结果
    formatter: (value: number) => string | number = (value: number) => {
        return formatNumber(value, 'en_US', '1.0-6');
    };
    parser: (value: string) => string = (value: string) => {
        return value.replaceAll(",", '');
    };


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
