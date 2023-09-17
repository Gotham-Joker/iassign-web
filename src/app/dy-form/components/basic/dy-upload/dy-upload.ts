import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {environment} from "../../../../../environments/environment";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NgIf } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
    selector: 'dy-upload',
    templateUrl: './dy-upload.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NgIf, NzUploadModule, NzButtonModule, NzWaveModule, NzIconModule]
})
export class DyUpload implements OnInit {

    value: any = null;
    // 默认配置
    config: any = {
        type: 'upload',
        noColon: false,
        label: '附件',
        name: 'file', // 上传到后端的参数名
        dyColSpan: 12,
        required: false,
        placeholder: '',
        // 默认上传到本系统后台
        url: '/upload',
        res: 'data'
    };
    status: any = null;
    fileList: any[] = [];


    constructor() {
    }

    ngOnInit(): void {
    }

    change(ev: any) {
        let fileList = [...ev.fileList];
        fileList = fileList.map(file => {
            if (file.response) {
                file.uid = file.response[this.config.res].id;
                file.url = file.response[this.config.res].url;
                file.name = file.response[this.config.res].name;
            }
            return file;
        });

        this.fileList = fileList;
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


}
