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

import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import  _ from "lodash"
import {inject} from "@angular/core";

export abstract class BaseService {
    protected http: HttpClient;

    constructor(protected baseUrl: string) {
        this.http = inject(HttpClient);
    }

    query(params: any): Observable<any> {
        return this.http.get(this.baseUrl, {params: params});
    }

    queryById(id: any): Observable<any> {
        return this.http.get(`${this.baseUrl}/${id}`);
    }

    remove(id: any): Observable<any> {
        return this.http.delete(`${this.baseUrl}?id=${id}`);
    }

    save(data: any): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }

    update(data: any): Observable<any> {
        return this.http.put(this.baseUrl, data);
    }

    // 根据是否有id来判断是用save还是update
    saveOrUpdate(data: any): Observable<any> {
        return _.isEmpty(data.id) && !_.isNumber(data.id) ? this.save(data) : this.update(data);
    }
}
