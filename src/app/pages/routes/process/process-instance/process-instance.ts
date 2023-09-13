import {Component, OnInit} from '@angular/core';
import {ProcessService} from "../process.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {StartupService} from "../../../../core/startup.service";
import * as dayjs from "dayjs";
import {OnReuseRetrieve} from "../../../../core/route-reuse";

@Component({
    selector: 'app-process-instance',
    templateUrl: './process-instance.html',
    styleUrls: ['./process-instance.scss']
})
export class ProcessInstance implements OnInit, OnReuseRetrieve {
    loading: boolean = false;
    queryParams: any = {
        page: 1,
        size: 10,
        id_odd: 1
    };
    list: any[] = [];
    total: number = 0;
    createTime_le: any;
    createTime_ge: any;


    constructor(private processSvc: ProcessService, private startupSvc: StartupService,
                private message: NzMessageService) {
    }

    /**
     * 路由复用触发时重新查询数据，防止列表的数据太旧
     */
    onReuseRetrieve(): void {
        this.query();
    }

    ngOnInit(): void {
        // 只查询自己的申请
        this.queryParams.starter = this.startupSvc.userInfo.id;
        this.query();
    }

    query(page?: number) {
        this.loading = true;
        if (page) {
            this.queryParams.page = page;
        }
        this.queryParams.createTime_le = this.formatDate(this.createTime_le);
        this.queryParams.createTime_ge = this.formatDate(this.createTime_ge);
        this.processSvc.queryInstance(this.queryParams).subscribe((res: any) => {
            this.total = res.data.total;
            this.list = res.data.list;
            this.queryParams.page = res.data.page;
            this.loading = false;
        })
    }

    private formatDate(date: any) {
        if (date != null && date != '') {
            return dayjs(date).format('YYYY-MM-DD');
        } else {
            return '';
        }
    }

    /**
     * 撤销流程实例
     * @param id
     */
    cancel(id) {
        this.loading = true;
        this.processSvc.cancel(id).subscribe(() => {
            this.query();
            this.message.success("success");
        })
    }
}
