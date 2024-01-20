import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {mergeMap, Observable, of} from "rxjs";
import {HttpBackend, HttpClient} from "@angular/common/http";

@Component({
    selector: 'dy-upload',
    templateUrl: './dy-upload.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NzUploadModule, NzButtonModule, NzWaveModule, NzIconModule]
})
export class DyUpload implements OnInit {

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
