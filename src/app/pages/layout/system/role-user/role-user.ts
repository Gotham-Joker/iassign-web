import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzTableModule} from "ng-zorro-antd/table";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {RoleUserService} from "./role-user.service";

@Component({
    selector: 'role-user',
    templateUrl: 'role-user.html',
    standalone: true,
    imports: [NzTableModule, NgForOf, NzCardModule, NzFormModule, FormsModule, NzInputModule, NzButtonModule]
})

export class RoleUser implements OnInit, OnChanges {
    @Input()
    roleId: '';
    queryParams: any = {
        page: 1,
        size: 10,
        id: '',
        username: '',
        email: ''
    }
    list: any[] = [];
    total: number = 0;
    loading: boolean = false;

    constructor(private roleUserSvc: RoleUserService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
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