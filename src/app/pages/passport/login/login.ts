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
