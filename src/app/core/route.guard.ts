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

import {Observable, of} from 'rxjs';
import {inject, Injectable} from "@angular/core";
import {StartupService} from "./startup.service";

/**
 * 路由守卫，判断用户是否能访问某些页面
 * 目的：防止没权限的用户通过浏览器地址栏输入url直接进入本应不能访问的页面
 * 其实这个功能类似于acl.directive.ts
 */
@Injectable({providedIn: 'root'})
export class RouteGuard {
    private startupService: StartupService;

    constructor() {
        this.startupService = inject(StartupService);
    }

    /**
     * 判断当前用户是否拥有指定权限，有的话才可以访问指定的页面
     * @param requiredPrivilege
     */
    public canActive(requiredPrivilege: any): Observable<boolean> {
        return of(true);
        if (this.startupService.userInfo.admin) { // 超级管理员拥有一切权限
            return of(true);
        }
        const permissions = this.startupService.permissions as string[];
        if (Array.isArray(requiredPrivilege)) {
            for (let i = 0; i < requiredPrivilege.length; i++) {
                const item = requiredPrivilege[i];
                if (!permissions.includes(item)) {
                    return of(false);
                }
            }
        } else {
            if (!permissions.includes(requiredPrivilege)) {
                return of(false);
            }
        }
        return of(true);
    }


}
