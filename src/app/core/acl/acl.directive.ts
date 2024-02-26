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

import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {StartupService} from "../startup.service";

/**
 * 权限访问控制
 * 用例: <button *acl="'api_upload'">提交</button>
 * 那么只有当前用户是管理员或者拥有api_upload权限才显示这个按钮
 * ACL: 即访问控制列表Access Control List
 */
@Directive({
    selector: '[acl]',
    standalone: true
})
export class AclDirective {

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private startupSvc: StartupService) {
    }

    @Input('acl')
    set condition(condition: string[] | string) {
        if (this.startupSvc.userInfo.admin) { // 超级管理员拥有一切权限
            this.viewContainer.createEmbeddedView(this.templateRef);
            return;
        }
        const permissions = this.startupSvc.permissions as string[];
        if (Array.isArray(condition)) {
            for (let i = 0; i < condition.length; i++) {
                const permission = condition[i];
                if (!permissions.includes(permission)) {
                    this.viewContainer.clear();
                    return;
                }
            }
        } else {
            if (!permissions.includes(condition)) {
                this.viewContainer.clear();
                return;
            }
        }
        this.viewContainer.createEmbeddedView(this.templateRef);
    }

}
