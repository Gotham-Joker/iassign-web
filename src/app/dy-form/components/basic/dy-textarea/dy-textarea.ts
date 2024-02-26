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

import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, Validators, FormsModule} from "@angular/forms";
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";

@Component({
    selector: 'dy-textarea',
    templateUrl: './dy-textarea.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NzInputModule, FormsModule, NzTabComponent, NzDividerComponent, NzButtonComponent, NzSwitchComponent, NzInputNumberComponent, NzTabSetComponent]
})
export class DyTextarea implements OnInit , DyComponent {
    @ViewChild('cfgTpl', {read: TemplateRef, static: true})
    templateRef;
    config: any = {
        type: 'textarea',
        noColon: false,
        label: '文本',
        dyColSpan: 12,
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
