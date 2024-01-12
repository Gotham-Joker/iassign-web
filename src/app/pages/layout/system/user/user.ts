import {Component, OnInit} from '@angular/core';
import {UserService} from "./user.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NgFor } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {AclDirective} from "../../../../core/acl/acl.directive";

@Component({
    selector: 'app-user',
    templateUrl: './user.html',
    standalone: true,
    imports: [NzSpinModule, NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzButtonModule, NzWaveModule, NzIconModule, NzTableModule, NgFor, NzSwitchModule, NzDividerModule, NzPopconfirmModule, AclDirective, RouterLink]
})
export class User implements OnInit {
    queryParams: any = {
        page: 1,
        size: 10,
        flag: ""
    };
    list: any[] = [];
    total: number = 0;  // 数据总条数
    loading: boolean = false; // 整个页面加载中

    constructor(private userSvc: UserService, private message: NzMessageService,
                private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit(): void {
        this.query()
    }

    pageChange($event: number) {
        this.queryParams.page = $event;
        this.query();
    }

    query(pageOne?: boolean) {
        this.loading = true;
        if (pageOne) { // 是否从第一页开始查询
            this.queryParams.page = 1;
        }
        // 查询
        this.userSvc.query(this.queryParams).subscribe(res => {
            this.list = res.data.list;
            this.queryParams.page = res.data.page;
            this.queryParams.size = res.data.size;
            this.total = res.data.total;
            this.loading = false;
        });
    }

    edit(item: any) { // 打开编辑页面
        if (item) {
            this.router.navigate([item.id], {relativeTo: this.route});
        }
    }

    remove(id: any) { // 删除用户
        this.userSvc.remove(id).subscribe(() => this.query())
    }

    setAdmin(user: any, isAdmin: any) {
        this.loading = true;
        this.userSvc.setAdmin(user.id, isAdmin).subscribe(res => {
            this.query();
        });
    }

}
