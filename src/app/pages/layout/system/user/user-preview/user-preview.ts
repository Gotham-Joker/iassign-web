import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {RoleService} from "../../role/role.service";
import {catchError, mergeMap} from "rxjs/operators";

@Component({
    selector: 'app-user-view',
    templateUrl: './user-preview.html'
})
export class UserPreview implements OnInit {
    form!: FormGroup;
    loading: boolean = false;
    roles: any = [];
    userId: any;
    fetching: boolean = true;

    constructor(private userSvc: UserService, private fb: FormBuilder,
                private roleSvc: RoleService, private message: NzMessageService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            'id': [null, [Validators.required]],
            'username': [null, [Validators.required]],
            'roleIds': [[]],
            'email': [null],
            'deptId': ['', [Validators.required]],
        });
        // 获取路由参数
        this.route.params.subscribe((params: any) => {
            this.userId = params.id;
            // 从后端加载数据
            this.fetchData(params.id);
        });
    }

    save() { // 保存
        this.loading = true;
        this.userSvc.update(this.form.value).subscribe(res => {
            this.loading = false;
            this.message.success('保存成功');
        });
    }

    /**
     * 查询角色列表和用户详情
     * @param id
     */
    private fetchData(id: any) {
        this.roleSvc.query({page: 1, size: 1000})
            .pipe(mergeMap(res => {
                // 处理角色列表
                const roles: any[] = [];
                res.data.list.forEach((e: any) => {
                    roles.push({key: e.id, title: e.name});
                });
                this.roles = roles;
                return this.userSvc.queryById(id);
            }), catchError(res => {
                this.fetching = false;
                return res;
            })).subscribe(res => {
            // 处理用户信息
            this.form.patchValue(res.data);
            this.fetching = false;
        });
    }
}