import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, Validators, FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";

@Component({
    selector: 'dy-select',
    templateUrl: './dy-select.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NzSelectModule, FormsModule, NgFor, NzDividerComponent, NzInputDirective, NzTabComponent, NzCheckboxComponent, NzButtonComponent, NzSwitchComponent, NzInputNumberComponent, NzTabSetComponent]
})
export class DySelect implements OnInit , DyComponent {
    @ViewChild('cfgTpl', {read: TemplateRef, static: true})
    templateRef;
    config: any = {
        type: 'select',
        label: '选择',
        dyColSpan: 12,
        options: '0|Alex\n1|Judith',
        mode: 'default',
        value: '',
        allowClear: false,
        snapshot: false // 快照模式
    };
    status: any;
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
        const control = new FormControl(this.config.value, validators);
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

    /**
     * 修改模式
     * @param $event
     */
    changeMode($event: any) {
        if ($event == 'multiple') {
            if (this.config.value == '') {
                this.config.value = [];
            }
        } else {
            if (Array.isArray(this.config.value) && this.config.value.length == 0) {
                this.config.value = '';
            }
        }
    }

}
