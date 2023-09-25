import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpBackend, HttpClient} from "@angular/common/http";
import {mergeMap, of} from "rxjs";
import {FormControl, Validators, FormsModule} from "@angular/forms";
import {formatNumber, NgIf, NgSwitch, NgSwitchCase, NgFor, NgTemplateOutlet, NgSwitchDefault} from "@angular/common";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';

@Component({
    selector: 'dy-form',
    templateUrl: './dy-form.html',
    standalone: true,
    imports: [
        NzGridModule,
        NzFormModule,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NzInputModule,
        FormsModule,
        NzInputNumberModule,
        NzDatePickerModule,
        NzSelectModule,
        NgFor,
        NzCheckboxModule,
        NzRadioModule,
        NzUploadModule,
        NzButtonModule,
        NzWaveModule,
        NzIconModule,
        NgTemplateOutlet,
        NgSwitchDefault,
    ],
})
export class DyForm implements OnInit, OnChanges {
    @Input()
    form: any = {};
    private http: HttpClient;
    dateFormat = 'yyyy-MM-dd';
    dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';

    @Input()
    readonly: boolean = false;

    numberFormatter: (value: number) => string | number = (value: number) => {
        return formatNumber(value, 'en_US', '1.0-6');
    };
    numberParser: (value: string) => string = (value: string) => {
        return value.replaceAll(",", '');
    };

    options: any = {};

    /**
     *
     * @param httpBackend
     * @param httpClient 应用全局http
     */
    constructor(private httpBackend: HttpBackend, private httpClient: HttpClient) {
        this.http = new HttpClient(httpBackend); // 构造新的http实例，不带拦截器
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['form']?.firstChange) {
            const children = this.form.children;
            for (let i = 0; i < children.length; i++) {
                const item = children[i];
                if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
                    this.options[item.field] = [];
                    this.fetchOptions(this.options[item.field], item);
                }else if (item.type=='row'){
                    const rowChildren = item.children;
                    for (let j = 0; j < rowChildren.length; j++) {
                        let rowChild = rowChildren[j];
                        if (rowChild.type == 'select' || rowChild.type == 'checkbox' || rowChild.type == 'radio') {
                            this.options[rowChild.field] = [];
                            this.fetchOptions(this.options[rowChild.field], rowChild);
                        }
                    }
                }
            }
        }
    }

    upload(config: any) {
        const url = config.url;
        const key = config.res;
        const varName = config.name;
        return (file, fileList) => {
            const form = new FormData();
            form.append(varName, file);
            let post;
            if (url.startsWith("/")) { // 上传到本系统
                post = this.httpClient.post(url, form);
            } else { // 上传到其他系统
                post = this.http.post(url, form);
            }
            return post.pipe(mergeMap((res: any) => {
                const file = res[key]
                config.value = [...config.value, file];
                return of(false);
            }))
        };
    }

    validate(): boolean {
        let successful = true;
        const children = this.form.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.type == 'row') {
                const rowChildren = child.children;
                for (let j = 0; j < rowChildren.length; j++) {
                    const rowChild = rowChildren[j];
                    if (!this.validateControl(rowChild)) {
                        successful = false;
                    }
                }
            } else {
                if (!this.validateControl(child)) {
                    successful = false;
                }
            }
        }
        return successful;
    }

    private validateControl(config: any): boolean {
        const validators = [];
        // 添加校验函数
        if (config.required) {
            const requiredFn = (ctl: any) => {
                return Validators.required(ctl);
            };
            validators.push(requiredFn);
        }
        if (config.regex) {
            validators.push(Validators.pattern(config.regex));
        }
        // 开始校验
        const control = new FormControl(config.value, validators);
        if (control.invalid) {
            config.status = 'error';
            control.markAsDirty();
            control.updateValueAndValidity({onlySelf: true});
            return false;
        } else {
            config.status = '';
            control.markAsDirty();
            control.updateValueAndValidity({onlySelf: true});
            return true;
        }
    }

    checkboxChange($event: boolean, config, item: string) {
        if (config.value == null || config.value == "") {
            config.value = [];
        }
        const indexOf = config.value.indexOf(item);
        if ($event) {
            if (indexOf == -1) {
                config.value.push(item);
            }
        } else {
            if (indexOf != -1) {
                config.value.splice(indexOf, 1);
            }
        }
    }

    isCheck(value, optionValue: any) {
        if (value == null || !Array.isArray(value) || value.length == 0) {
            return false;
        }
        return value.indexOf(optionValue) != -1;
    }

    fetchOptions(options: any[], config: any) {
        if (config.url) {
            if (this.form['context']) {
                const context = this.form['context'];
                Object.keys(context).forEach(key => {
                    config.url = config.url.replaceAll("${" + key + "}", "" + context[key]);
                })
            }
            this.httpClient.get(config.url).subscribe(res => {
                const data = res[config.res]
                if (data != null) {
                    for (let i = 0; i < data.length; i++) {
                        const option = data[i];
                        options.push({label: option[config.resLabel], value: option[config.resValue]});
                    }
                }
            })
        } else {
            const splits = config.options.split('\n');
            for (let i = 0; i < splits.length; i++) {
                const option = splits[i];
                options.push({label: option, value: option})
            }
        }
    }
}
