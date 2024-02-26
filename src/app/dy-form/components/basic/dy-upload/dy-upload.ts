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
import {FormControl, FormsModule, Validators} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {mergeMap, Observable, of} from "rxjs";
import {HttpBackend, HttpClient} from "@angular/common/http";
import {DyComponent} from "../../../interface/dy-form-interface";
import {NzDescriptionsComponent, NzDescriptionsItemComponent} from "ng-zorro-antd/descriptions";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";

@Component({
    selector: 'dy-upload',
    templateUrl: './dy-upload.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NzUploadModule, NzButtonModule, NzWaveModule, NzIconModule, NzDescriptionsComponent, NzDescriptionsItemComponent, NzDividerComponent, NzInputDirective, FormsModule, NzTabComponent, NzSwitchComponent, NzInputNumberComponent, NzOptionComponent, NzSelectComponent, NzTabSetComponent]
})
export class DyUpload implements OnInit , DyComponent {
    @ViewChild('cfgTpl', {read: TemplateRef, static: true})
    templateRef;
    // 默认配置
    config: any = {
        type: 'upload',
        noColon: false,
        label: '附件',
        listType: 'text',
        accept: '',
        name: 'file', // 上传到后端的参数名
        dyColSpan: 12,
        required: false,
        placeholder: '',
        // 默认上传到本系统后台
        url: '/upload',
        res: 'data',
        value: []
    };
    status: any = null;
    upload = (file, fileList): Observable<boolean> => {
        const url = this.config.url;
        let httpCli = url.startsWith("/") ? this.httpClient : this.http;
        const form = new FormData();
        form.append(this.config.name, file);
        return httpCli.post("/upload", form).pipe(mergeMap(resp => {
            this.config.value = [...this.config.value, resp[this.config.res]]
            return of(false);
        }));
    };
    private http: HttpClient; // 外部访问

    constructor(private httpClient: HttpClient, private httpBackend: HttpBackend) {
        this.http = new HttpClient(this.httpBackend);
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
