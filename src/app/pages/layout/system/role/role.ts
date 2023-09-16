import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {FormBuilder, Validators} from "@angular/forms";
import {RoleService} from "./role.service";
import {MenuService} from "../menu/menu.service";
import {PermissionService} from "../permission/permission.service";
import {zip} from "rxjs";

@Component({
    selector: 'app-role',
    templateUrl: './role.html'
})
export class Role implements OnInit {
    queryParams: any = {
        page: 1,
        size: 10
    };
    list: any[] = [];
    total: number = 0;
    loading: boolean = false;

    modal: any = { // 编辑框
        title: '编辑',
        loading: false,
        visible: false,
        menus: [],// 可选菜单
        pms: [],// 可选权限
        form: null
    };


    constructor(private roleSvc: RoleService,
                private menuSvc: MenuService,
                private pmSvc: PermissionService,
                private message: NzMessageService,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.initModalForm();
        this.query();
    }

    query(pageOne?: boolean) {
        if (pageOne) {
            this.queryParams.page = 1;
        }
        this.loading = true;
        this.roleSvc.query(this.queryParams).subscribe(res => {
            this.list = res.data.list;
            this.queryParams.page = res.data.page;
            this.queryParams.size = res.data.size;
            this.total = res.data.total;
            this.loading = false;
        })
    }

    remove(id: any) {
        this.roleSvc.remove(id).subscribe(res => {
            this.query();
        });
    }

    pageChange($event: number) {
        this.queryParams.page = $event;
        this.query();
    }

    save() {
        // 表单校验
        if (!this.isValid()) {
            return;
        }
        this.modal.loading = true;
        const data = this.modal.form.value;
        this.roleSvc.saveOrUpdate(data).subscribe(res => {
            this.modal.loading = false;
            this.modal.visible = false;
            this.query();
        });
    }

    /**
     * 校验表单
     */
    private isValid(): boolean {
        if (!this.modal.form.valid) {
            Object.values(this.modal.form.controls).forEach((control: any) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true})
                }
            });
            return false;
        }
        return true;
    }


    /**
     * 初始化弹窗表单
     */
    private initModalForm() {
        this.modal.form = this.fb.group({
            'id': [null],
            'name': [null, Validators.required],
            'menuIds': [], // 已选中的菜单,value是数组
            'permissionIds': [] // 已选中的权限,value是数组
        });
        const params = {page: 1, size: 1000};
        // 同时对菜单和权限接口发送请求
        zip(
            this.menuSvc.query(Object.assign({}, params, {weight_oda: 1})),
            this.pmSvc.query(params)
        ).subscribe(([menuRes, pmRes]) => {
            let menus: any[] = [];
            let pms: any[] = [];
            menuRes.data.list.forEach((e: any) => {
                menus.push({key: e.id, title: e.text})
            });
            pmRes.data.list.forEach((e: any) => {
                pms.push({key: e.id, title: e.name})
            });
            this.modal.menus = menus;
            this.modal.pms = pms;
        });
    }

    edit(obj: any) {
        if (obj) {
            this.modal.loading = true;
            this.modal.title = '编辑';
            // 查找详情
            this.roleSvc.findDetails(obj.id).subscribe((res: any) => {
                // number数组转字符数组
                res.data.menuIds = res.data.menuIds.map((e: any) => e + '');
                res.data.permissionIds = res.data.permissionIds.map((e: any) => e + '');
                this.modal.form.patchValue(res.data);
                this.modal.loading = false;
                this.modal.visible = true;
            }, error => this.modal.loading = false);
        } else {
            this.modal.title = '新增';
            this.modal.form.reset({menuIds: [], permissionIds: []}); // 重置表单
            this.modal.visible = true;
        }
    }


}