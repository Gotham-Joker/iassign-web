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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouteReuseStrategy} from "@angular/router";
import {LoginService} from "./login.service";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {RouteReuse} from "../../../core/route-reuse";
import {catchError} from "rxjs/operators";
import {EMPTY} from "rxjs";
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
    standalone: true,
    imports: [NzSpinModule, NzIconModule, FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule]
})
export class LoginComponent implements OnInit {

    loginReq!: FormGroup; // 保存登录表单数据
    isLoading: boolean = false; // loading动画

    constructor(private fb: FormBuilder,
                private notice: NzNotificationService,
                private router: Router,
                private route: ActivatedRoute,
                private routeReuse: RouteReuseStrategy, // 退出登录应该清空路由复用策略
                private loginSvc: LoginService) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(res => {
            if (res.code) {
                this.notice.warning('提示', res.msg);
            }
        });
        // 清空路由复用策略
        const routeReuse = this.routeReuse as RouteReuse;
        routeReuse.clear();

        // 初始化登录表单默认值和校验规则
        this.loginReq = this.fb.group({
            id: ['', [Validators.required]],
            password: ['', [Validators.required]],
            rememberMe: [true],
        });
    }

    submit() { // 提交表单
        if (this.isLoading) { // 防止重复提交
            return;
        }
        if (!this.isValid()) { // 校验表单
            return;
        }
        this.isLoading = true;
        this.loginSvc.login(this.loginReq.value).pipe(catchError(err => {
            this.isLoading = false;
            return EMPTY;
        })).subscribe(res => {
            this.isLoading = false;
            this.router.navigateByUrl('/');
        });
    }

    /**
     * 校验表单
     */
    private isValid(): boolean {
        if (!this.loginReq.valid) {
            Object.values(this.loginReq.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true})
                }
            });
            return false;
        }
        return true;
    }

    enterKeyup(ev: KeyboardEvent) { // 在表单按下enter键
        if (ev != null && ev.key == "Enter") {
            this.submit();
        }
    }

}
