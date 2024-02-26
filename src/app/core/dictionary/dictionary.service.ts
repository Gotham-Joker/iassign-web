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

import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from "@angular/common/http";
import {Observable, of, switchMap} from "rxjs";
import  _ from "lodash"

@Injectable()
export class DictionaryService {
    private data: any = {};
    private http: HttpClient;

    constructor(private httpBackend: HttpBackend) {
        this.http = new HttpClient(httpBackend);
    }

    /**
     * 加载应用字典数据，可以放在前端的dictionary.json文件中，不需要从后端接口访问
     * 用到的时候直接使用管道操作符即可
     * 例如{{item.status|dict:'instanceStatus'}}自动把RUNNING变为"运行中"
     */
    load(): Observable<any> {
        return this.http.get('/assets/json/dictionary.json').pipe(switchMap((res: any) => {
            this.data = res;
            return of(1);
        }));
    }

    translate(value: any, args: any): string {
        if (value == null) {
            return value;
        }
        if (_.isArray(args)) {
            let attribute = this.data[args[0]][value];
            for (let i = 1; i < args.length; i++) {
                if (attribute[args[1]] == null) {
                    return 'UNKNOWN';
                }
                attribute = attribute[args[i]];
            }
            return attribute;
        }
        return this.data[args][value] ?? 'UNKNOWN';
    }
}
