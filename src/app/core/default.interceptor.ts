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

import {Injectable, Injector} from "@angular/core";
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest, HttpResponse,
    HttpResponseBase
} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, mergeMap} from "rxjs/operators";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";
import _ from "lodash";


const MESSAGE: { [key: number]: string } = {
    400: '客户端请求格式有误',
    404: '服务器没有此接口',
    500: '服务器出错了',
    502: '网关错误',
    503: '服务不可用或者网关过载',
    504: '网关超时'
}

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {
    }

    get notice(): NzNotificationService {
        return this.injector.get(NzNotificationService);
    }

    get router(): Router {
        return this.injector.get(Router);
    }

    handleData(ev: HttpResponseBase): Observable<any> {
        if (ev.status < 200 || ev.status >= 300) {
            const errorText = MESSAGE[ev.status] || ev.statusText;
            if (errorText != null && errorText != '') {
                this.notice.error('错误', errorText);
                return throwError(() => new Error(errorText));
            }
        }
        const body = (ev as HttpResponse<any>).body;
        switch (body.code) {
            case 0:
            case 200:
                break;
            case 401:
                localStorage.clear();
                this.router.navigate(['/passport/login'], {
                    queryParams: {code: body.code, msg: body.msg},
                    skipLocationChange: true
                });
                return throwError(body.msg);
            case 403:
                this.notice.warning("警告", "拒绝访问");
                return throwError(body.msg);
            default:
                this.notice.error('错误', body.msg);
                return throwError(body.msg);
        }
        return of(ev);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = environment.SERVER_URL + req.url;
        const update: any = {url};
        const token = localStorage.getItem('token');
        if (!_.isEmpty(token)) {
            update['setHeaders'] = {'Authorization': `${token}`}
        }
        const newReq = req.clone(update);
        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                if (event instanceof HttpResponseBase) {
                    return this.handleData(event);
                }
                return of(event);
            }),
            catchError((err) => {
                console.error(err);
                if (err instanceof HttpErrorResponse) {
                    return this.handleData(err);
                }
                return throwError(err);
            })
        );
    }

}
