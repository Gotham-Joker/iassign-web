import {Component, OnInit} from '@angular/core';
import dayjs from "dayjs";
import {ActivatedRoute} from "@angular/router";
import {ProcessService} from "../process.service";
import {catchError} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
    selector: 'process-index',
    templateUrl: 'process-index.html'
})

export class ProcessIndex implements OnInit {
    loading: boolean = false;
    queryParams: any = {
        page: 1,
        size: 10
    };
    bodyParams: any = {
        id: '',
        definitionId: '',
        content: '',
        starter: '',
        deptId: '',
        status: '',
        deptName: '',
        createTimeGe: '',
        createTimeLe: ''
    }
    list: any = [];
    total: number = 0;
    createTimeGe = dayjs().add(-1, 'month').toDate()
    createTimeLe = dayjs().toDate()


    constructor(private route: ActivatedRoute, private message: NzMessageService, private processSvc: ProcessService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params["id"]) {
                this.bodyParams.definitionId = params["id"];
                this.query(1);
            }
        })
    }

    query(page?: number) {
        if (page) {
            this.queryParams.page = page;
        }
        if (this.createTimeGe == null) {
            this.createTimeGe = dayjs().add(-1, 'month').toDate()
        }
        if (this.createTimeLe == null) {
            this.createTimeLe = dayjs().toDate()
        }
        const startDate = dayjs(this.createTimeGe).startOf("day");
        const endDate = dayjs(this.createTimeLe).endOf("day");
        this.bodyParams.createTimeGe = startDate.format("YYYY-MM-DD HH:mm:ss");
        this.bodyParams.createTimeLe = endDate.format("YYYY-MM-DD HH:mm:ss");
        if (startDate.isAfter(endDate)) {
            this.message.warning("日期开始时间不能超过结束时间");
            return;
        }
        if (startDate.add(1, "month").endOf("day").isBefore(endDate)) {
            this.message.warning("选择的日期范围不能超过一个月");
            return;
        }
        this.loading = true;
        this.processSvc.queryIndex(this.queryParams.page, this.queryParams.size, this.bodyParams)
            .pipe(catchError(err => {
                this.loading = false;
                return err;
            })).subscribe(res => {
            this.list = res.data.list;
            this.total = res.data.total;
            this.loading = false;
        });
    }

    download() {
        this.loading = true;
        this.processSvc.downloadIndex(this.bodyParams).subscribe(res => {
            this.loading = false;
            window.location.href = res.data;
        });
    }
}