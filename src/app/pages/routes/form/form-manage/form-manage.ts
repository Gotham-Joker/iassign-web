import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {DyformService} from "../dyform.service";

@Component({
    selector: 'app-form-manage',
    templateUrl: './form-manage.html',
    styleUrls: ['./form-manage.scss']
})
export class FormManage implements OnInit {

    queryParams: any = {
        page: 1,
        size: 10,
        flag: ""
    };
    list: any[] = [];
    total: number = 0;  // 数据总条数
    // 整个页面加载中
    loading: boolean = false;

    constructor(private formSvc: DyformService, private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.query()
    }

    pageChange($event: any) {
        this.queryParams.page = $event;
        this.query();
    }

    query(pageOne?: boolean) {
        this.loading = true;
        if (pageOne) { // 是否从第一页开始查询
            this.queryParams.page = 1;
        }
        // 查询
        this.formSvc.query(this.queryParams).subscribe((res) => {
            this.list = res.data.list;
            this.queryParams.page = res.data.page;
            this.queryParams.size = res.data.size;
            this.total = res.data.total;
            this.loading = false;
        });
    }

    remove(id: any) { // 删除
        this.formSvc.remove(id).subscribe(() => this.query())
    }

}
