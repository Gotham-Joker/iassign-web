import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {RoleUserService} from "../../../layout/system/role-user/role-user.service";
import {NzTableModule} from "ng-zorro-antd/table";
import {NgForOf} from "@angular/common";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {IconsProviderModule} from "../../../../core/ng-zorro/icons-provider.module";

@Component({
    selector: 'role-user-list',
    templateUrl: 'role-user-list.html',
    standalone: true,
    imports: [NzTableModule, NgForOf, NzCardModule, NzFormModule, FormsModule, NzInputModule, NzButtonModule, IconsProviderModule]
})
export class RoleUserList implements OnInit, OnChanges {

    @Input()
    roleId: string = '';

    list: any[] = [];
    total: number = 0;
    loading: boolean = false;

    queryParams: any = {
        page: 1, size: 10,
        username: '',
        email: '',
        roleId: ''
    }

    constructor(private roleUserSvc: RoleUserService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['roleId'] != null) {
            this.query(1);
        }
    }

    query(page?: number) {
        if (page) {
            this.queryParams.page = page;
        }
        this.loading = true;
        this.queryParams.roleId = this.roleId;
        this.roleUserSvc.query(this.queryParams).subscribe(res => {
            this.list = res.data.list;
            this.total = res.data.total;
            this.loading = false;
        })
    }
}