import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormsModule, Validators} from "@angular/forms";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {RichText} from "../../../../core/components/rich-text/rich-text";

@Component({
    selector: 'dy-richtext',
    templateUrl: 'dy-richtext.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NzInputModule, FormsModule, NzButtonComponent, NzSwitchComponent, NzTabComponent, NzTabSetComponent, RichText]
})

export class DyRichtext implements OnInit, DyComponent {
    @ViewChild('cfgTpl', {read: TemplateRef, static: true})
    templateRef;
    config: any = {
        type: 'richtext',
        noColon: false,
        label: '富文本',
        tool: true,
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