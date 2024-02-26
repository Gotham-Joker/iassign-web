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

import {Observable, of, zip} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, mergeMap} from "rxjs/operators";
import {Router} from "@angular/router";
import  _ from "lodash"

export interface UserInfo {
    id: string;
    admin: boolean;

    [key: string]: any;
}

/**
 * app启动时需要加载一些数据，例如用户信息和菜单信息，所以这个类用于登录成功后存储用户信息
 */
@Injectable()
export class StartupService {
    menus!: any; // 用户菜单
    userInfo!: UserInfo; // 用户信息
    permissions!: any; // 用户权限信息

    constructor(private http: HttpClient, private router: Router) {
    }

    /**
     * 关闭启动时的全屏加载页面。因为加载页不受angular管控，所以这里用原生的js关闭掉它
     */
    public closeBootstrapLoading() {
        (document.querySelector('.loader-container') as any).style.display = 'none';
    }

    /**
     * 为避免请求菜单、权限等接口时等待的时间过长，我们可以在项目启动的时候设定一个延时，向用户展示一下加载页以便进行缓冲
     * @param delay 时延 即启动页最少展示的时长
     */
    public load(): Observable<any> {
        const token = localStorage.getItem('token');
        if (_.isEmpty(token)) {
            this.closeBootstrapLoading();
            this.router.navigateByUrl('/passport/login');
            return of(1);
        }
        return zip(
            this.http.get('/api/user-info'),
            this.http.get('/api/user-menus'),
            this.http.get('/api/user-permissions')
        ).pipe(
            mergeMap(([userInfo, menus, permissions]: any[]) => {
                this.userInfo = userInfo.data;
                this.menus = menus.data;
                this.permissions = permissions.data;
                this.closeBootstrapLoading();
                return of(1);
            }),
            catchError(err => {
                this.closeBootstrapLoading();
                return of(err);
            })
        );
    }

    uploadAvatar(file): Observable<any> {
        const form = new FormData();
        form.append("file", file);
        return this.http.post('/api/user-avatar', form);
    }
}
