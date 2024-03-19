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

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpBackend, HttpClient} from "@angular/common/http";
import {delay, mergeMap, of, Subject} from "rxjs";
import {FormControl, FormsModule, Validators} from "@angular/forms";
import {
    formatDate,
    formatNumber,
    NgClass,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgTemplateOutlet
} from "@angular/common";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzUploadFile, NzUploadModule} from 'ng-zorro-antd/upload';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {RichText} from "../core/components/rich-text/rich-text";
import {NzCascaderComponent, NzCascaderOption} from "ng-zorro-antd/cascader";

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
        RichText,
        NgClass,
        NzCascaderComponent,
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
    // map类型，其中key是string类型，value是数组类型
    options: { [key: string]: any[] } = {};
    richText: any = {} // 富文本显示
    $subject: Subject<any> = new Subject<any>();

    private cascade: boolean = false; // 表单是否存在联动关系

    numberFormatter: (value: number) => string | number = (value: number) => {
        return formatNumber(value, 'en_US', '1.0-6');
    };
    numberParser: (value: string) => string = (value: string) => {
        return value.replaceAll(",", '');
    };
    preview = (file: NzUploadFile) => {
        window.open(file.url + "?preview=1");
    };
    // 级联组件
    cascaders: any = {};


    constructor(private httpBackend: HttpBackend, private httpClient: HttpClient) {
        // http站外访问，而httpClient是站内访问: 带有拦截器
        this.http = new HttpClient(httpBackend);
    }

    ngOnInit(): void {
        this.$subject.pipe(delay(300)).subscribe(res => {
            if (res != null && res.length > 0) {
                for (let i = 0; i < res.length; i++) {
                    const item = res[i];
                    // 将润色完毕的富文本进行二次加工(目的是尽量不要绕过angular安全策略)
                    this.richText[item.field] = RichText.polishAndProcess(item.value);
                }
            }
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['form'] != null) {
            if (this.form.children != null) {
                this.renderForm();
            }
        }
    }

    private renderForm() {
        const richTextItem = [];
        const val = {};
        this.formIterate((item) => {
            if (item.cascade != null && item.cascade != "") {
                this.cascade = true; // 存在联动关系，启用联动
            }
            if (item.field) {
                val[item.field] = item.value;
            }
            if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
                this.options[item.field] = [];
                this.fetchOptions(this.options[item.field], item);
            } else if (item.type == 'richtext') {
                richTextItem.push(item);
            } else if (item.type == "cascader") {
                this.initCascaders(item);
            }
        });
        this.$subject.next(richTextItem);
        if (this.cascade) {
            this.evaluateHidden(val);
        }
    }

    upload(config: any) {
        const url = config.url;
        const key = config.res;
        const varName = config.name;
        return (file, fileList) => {
            const form = new FormData();
            form.append(varName, file);
            let req;
            if (url != null && url.startsWith("/")) {
                req = this.httpClient;
            } else {
                req = this.http;
            }
            return req.post(url, form).pipe(mergeMap((res: any) => {
                const file = res[key]
                config.value = [...config.value, file];
                return of(false);
            }))
        };
    }

    /**
     * 表单校验
     */
    validate(): boolean {
        let successful = true;
        this.formIterate((config) => {
            if (config.type != 'row') {
                if (!config.hidden) {
                    if (!this.validateControl(config)) {
                        successful = false;
                    }
                }
            } else if (config.type == 'row' && config.hidden) {
                return true;
            }
            return false;
        });
        return successful;
    }

    /**
     * 遍历表单控件
     * @param handler 处理函数，返回true则表示跳过孩子节点，加快程序效率
     */
    private formIterate(handler: (item) => void | boolean) {
        const children = this.form.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const skipChildren = handler(child);
            if (skipChildren) {
                continue;
            }
            if (child.type == 'row') {
                const rowChildren = child.children;
                for (let j = 0; j < rowChildren.length; j++) {
                    const rowChild = rowChildren[j];
                    handler(rowChild);
                }
            }
        }
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

    isCheck(value, item: any) {
        if (value == null || !Array.isArray(value) || value.length == 0) {
            return false;
        }
        return value.indexOf(item) != -1;
    }

    /**
     * 获取下拉框选项数据
     * @param options
     * @param item
     * @private
     */
    private fetchOptions(options: any, item: any) {
        if (item.url) {
            let req = item.url.startsWith("/") ? this.httpClient.get(item.url) : this.http.get(item.url);
            req.subscribe(res => {
                let splits = item.res.split(".");
                let data: any = res;
                for (let i = 0; i < splits.length; i++) {
                    data = data[splits[i]]
                }
                if (data != null) {
                    for (let i = 0; i < data.length; i++) {
                        const option = data[i];
                        let label = option[item.resLabel];
                        if (item.resLabel2 != null && item.resLabel2 != '') {
                            label = label + '(' + option[item.resLabel2] + ')';
                        }
                        if (item.resLabel3 != null && item.resLabel3 != '') {
                            label = label + '<' + option[item.resLabel3] + '>';
                        }
                        options.push({label: label, value: option[item.resValue]})
                    }
                }
            })
        } else {
            const splits = item.options.split('\n');
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
                options.push({label: label, value: value});
            }
        }
    }

    /**
     * 获取最终表单数据，包括填写的数据
     */
    data(): any {
        this.formIterate((item) => {
            if (item.type == 'select' && item.snapshot) {
                this.generateSnapshot(item);
            }
        })
        return this.form;
    }

    /**
     * 当url返回的options数据量很大时，生成快照是很好的。
     * 此函数是为下拉框选项生成快照（只有被选中的选项会生成快照，避免每次加载表单都重新访问url，以及当url返回的options中
     * 不存在相应的value导致选择框没有选中相应的值：可能这个value已经被远程服务器删除，或者url接口无法保证幂等性）
     * @param item 控件
     * @private
     */
    private generateSnapshot(item: any) {
        if (item.url) {
            item['url'] = null;
            const options = this.options[item.field];
            // 构造map
            const optionMap = {};
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                optionMap[option['value']] = option['label'];
            }
            let optionsStr = '';
            // 组件的值不是数组
            if (!Array.isArray(item.value)) {
                optionsStr = item.value + "|" + optionMap[item.value];
            } else { // 组件的值是数组
                for (let j = 0; j < item.value.length; j++) {
                    const val = item.value[j];
                    optionsStr = optionsStr + val + "|" + optionMap[val] + "\n";
                }
            }
            // 最后一个不需要换行符
            if (optionsStr != null && optionsStr.endsWith("\n")) {
                optionsStr = optionsStr.substring(0, optionsStr.length - 1);
            }
            item.options = optionsStr;
        }
    }

    formatDate(val, item: any) {
        if (val) {
            item.value = formatDate(val, this.dateTimeFormat, 'zh_CN');
        } else {
            item.value = '';
        }
    }

    modelChange($event: any, config: any) {
        config.value = $event;
        if (this.cascade) { // 如果存在联动关系，开启联动判断，隐藏或显示其他控件
            const val: any = {}
            this.formIterate((item) => {
                if (item.type == 'row') {
                    if (item.hidden) {
                        return true;
                    }
                    return false;
                }
                // 构造map对象，将值填充进去，用来进行接下来的判断
                val[item['field']] = item['value'];
                return false;
            })
            this.evaluateHidden(val);
        }
    }

    private evaluateHidden(val) {
        const ctxKeys = Object.keys(val);
        const ctxValues = [];
        ctxKeys.forEach(key => ctxValues.push(val[key]));
        this.formIterate((item) => {
            if (item.field) {
                ctxKeys.push(item.field);
                ctxValues.push(null);
            }
            // 隐藏或展示
            if (item.cascade != null && item.cascade.trim() != '') {
                item.hidden = new Function(...ctxKeys, "return " + item.cascade)(...ctxValues);
            }
        });
    }

    private initCascaders(item) {
        let http = this.http;
        if (item.url != null && item.url.startsWith("/")) {
            http = this.httpClient;
        }
        this.cascaders[item.field] = (node: NzCascaderOption, index: number) => {
            let value = node.value ? node.value : (item.dv ?? "");
            const url = item.url.replace("$$", value);
            return http.get(url).pipe(mergeMap((res: any) => {
                let data = item.res ? res[item.res] : res;
                if (data == null || data.length == 0) {
                    return of(1);
                }
                node.children = data;
                return of(1);
            }))
        }
    }
}
