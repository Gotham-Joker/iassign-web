/*
 * MIT License
 *
 * Copyright (c) 2024 Hongtao Liu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormsModule} from "@angular/forms";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzCascaderComponent} from "ng-zorro-antd/cascader";
import {JsonPipe} from "@angular/common";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";

@Component({
    selector: 'dy-cascader',
    standalone: true,
    imports: [
        NzFormItemComponent,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzCascaderComponent,
        FormsModule,
        NzDividerComponent,
        NzTabComponent,
        NzInputNumberComponent,
        NzSwitchComponent,
        NzTabSetComponent,
        NzInputDirective,
        NzButtonComponent,
        NzFormDirective,
        NzColDirective,
        NzRowDirective,
        NzIconDirective,
        NzTooltipDirective
    ],
    templateUrl: 'dy-cascader.html'
})

export class DyCascader implements OnInit, DyComponent {
    config: any = {
        type: 'cascader',
        label: '级联',
        url: '',
        value: [],
        dv: '', // 默认值
        regex: '',
        res: '',
        resLabel: '',
        resValue: '',
        required: false,
        cascade: '',
        dyColSpan: 12
    }
    status: any = '';

    // 配置面板实例
    @ViewChild('cfgTpl', {static: true, read: TemplateRef<any>})
    public templateRef: TemplateRef<any>;

    constructor() {
    }

    ngOnInit() {
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
        const control = new FormControl(this.config.value, validators);
        if (control.invalid) {
            this.status = 'error';
        } else {
            this.status = null;
        }
    }
}