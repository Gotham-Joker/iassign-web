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
        Backward
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

    constructor(private roleUserSvc: RoleUserService, private route: ActivatedRoute) {
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
}