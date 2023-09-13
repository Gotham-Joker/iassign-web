import {Component, OnInit} from '@angular/core';
import {UserService} from "./user.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-user',
    templateUrl: './user.html'
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
