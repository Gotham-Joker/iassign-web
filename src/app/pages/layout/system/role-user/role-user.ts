import {Component, OnInit} from '@angular/core';
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTableModule} from "ng-zorro-antd/table";
import {RoleUserService} from "./role-user.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {ActivatedRoute} from "@angular/router";
import {Backward} from "../../../../core/components/backward/backward";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
    selector: 'role-user',
    templateUrl: 'role-user.html',
    imports: [
        CommonModule,
        NzCardModule,
        NzTableModule,
        FormsModule,
        NzButtonModule,
        NzFormModule,
        NzGridModule,
        NzIconModule,
        NzInputModule,
        NzWaveModule,
        Backward,
        NzPopconfirmDirective
    ],
    standalone: true
})

export class RoleUser implements OnInit {
    list: any[] = [];
    total: number = 0;
    loading: boolean = false;

    queryParams: any = {
        page: 1, size: 10, roleId: ''
    }
    roleName: any = '';

    constructor(private roleUserSvc: RoleUserService, private route: ActivatedRoute, private message: NzMessageService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['roleId']) {
                this.queryParams.roleId = params['roleId'];
            }
            if (params['roleName']) {
                this.roleName = params['roleName'];
            }
            this.query();
        })
    }

    query(page?: number) {
        if (page) {
            this.queryParams.page = page;
        }
        this.loading = true;
        this.roleUserSvc.query(this.queryParams).subscribe(res => {
            this.list = res.data.list;
            this.total = res.data.total;
            this.loading = false;
        })
    }

    add() {
        if (this.queryParams.id == null || this.queryParams.id == '') {
            this.message.warning("请输入用户ID");
            return;
        }
        if (this.queryParams.roleId == null || this.queryParams.roleId == '') {
            this.message.warning("请输入角色ID");
            return;
        }
        this.roleUserSvc.rebindRoleUsers([{roleId: this.queryParams.roleId, addUserIds: [this.queryParams.roleId]}])
            .subscribe(res => {
                this.message.success("添加成功");
                this.query();
            })
    }

    remove(id) {
        if (this.queryParams.roleId == null || this.queryParams.roleId == '') {
            this.message.error("操作有误，请提供roleId");
            return;
        }
        const data = [{roleId: this.queryParams.roleId, delUserIds: [id]}];
        this.roleUserSvc.rebindRoleUsers(data).subscribe(res => {
            this.message.success("保存成功");
            this.query();
        })
    }
}