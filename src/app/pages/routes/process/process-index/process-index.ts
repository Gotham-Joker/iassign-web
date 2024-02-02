import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import dayjs from "dayjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ProcessService} from "../process.service";
import {catchError} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd/message";
import {DictPipe} from '../../../../core/dictionary/dict.pipe';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NgFor, NgIf} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {Backward} from "../../../../core/components/backward/backward";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {AclDirective} from "../../../../core/acl/acl.directive";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {StartupService} from "../../../../core/startup.service";

@Component({
    selector: 'process-index',
    templateUrl: 'process-index.html',
    styleUrls: ['process-index.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NzSpinModule, NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzSelectModule, NzDatePickerModule, NzButtonModule, NzWaveModule, NzIconModule, NgFor, NzDividerModule, RouterLink, NzTagModule, NgIf, NzPaginationModule, DictPipe, Backward, InfiniteScrollModule, AclDirective, NzPopconfirmModule]
})

export class ProcessIndex implements OnInit {
    loading: boolean = false;
    queryParams: any = {
        lastId: '', // 上一次分页查询的最后一条数据的id
        score: '', // 上一次分页查询最后一条数据的评分，那为何是string?因为java用的是double，可能会引起js精度问题
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
    createTimeGe = dayjs().add(-180, 'day').toDate()
    createTimeLe = dayjs().toDate()
    private currentUserId: string;
    private hasPermission: any = false;
    private processName: string = '';


    constructor(private route: ActivatedRoute, private message: NzMessageService,
                private startupSvc: StartupService, private processSvc: ProcessService) {
    }

    ngOnInit() {
        this.currentUserId = this.startupSvc.userInfo.id;
        const isAdmin = this.startupSvc.userInfo.admin;
        this.loading = true;
        this.route.queryParams.subscribe(params => {
            if (params["definitionId"]) {
                this.bodyParams.definitionId = params["definitionId"];
                // 先去判断当前用户有没有查询权限
                if (!isAdmin) {
                    this.processSvc.findDefinitionDetail(this.bodyParams.definitionId).subscribe(res => {
                        const managers = res.data.managers;
                        this.processName = res.data.name;
                        // 不指定流程管理者，则所有人都可查询，否则只有流程管理者可以查询
                        this.hasPermission = (managers == null || managers == '' || managers.includes(this.currentUserId));
                        this.query();
                    })
                } else {
                    this.hasPermission = true;
                    this.query();
                }
            }
        })
    }

    query() {
        if (!this.hasPermission) {
            this.message.error(`无查数权限:${this.processName}`);
            this.list = [];
            return;
        }
        this.queryParams.lastId = '';
        this.queryParams.score = '';
        // 查询前进行校验
        if (!this.validate()) {
            return;
        }
        this.loading = true;
        this.processSvc.queryIndex(this.queryParams.lastId, this.queryParams.score, this.queryParams.size, this.bodyParams)
            .pipe(catchError(err => {
                this.loading = false;
                return err;
            })).subscribe(res => {
            this.list = res.data.list;
            this.total = res.data.total;
            this.loading = false;
        });
    }

    /**
     * 滚动分页
     */
    scrollQuery() {
        if (!this.hasPermission) {
            this.message.error(`无查数权限:${this.processName}`);
            this.list = [];
            return;
        }
        // 取出上次最后一条数据的id，继续查
        if (this.list != null && this.list.length > 0) {
            const lastItem = this.list[this.list.length - 1];
            this.queryParams.lastId = lastItem.id;
            this.queryParams.score = lastItem.score;
            if (this.validate()) {
                this.loading = true;
                // 把查询结果追加到后面
                this.processSvc.queryIndex(this.queryParams.lastId, this.queryParams.score, this.queryParams.size, this.bodyParams)
                    .pipe(catchError(err => {
                        this.loading = false;
                        return err;
                    })).subscribe(res => {
                    const list = res.data.list;
                    for (let i = 0; i < list.length; i++) {
                        this.list.push(list[i]);
                    }
                    this.loading = false;
                });
            }
        }
    }

    download() {
        this.loading = true;
        this.processSvc.downloadIndex(this.bodyParams).subscribe(res => {
            this.loading = false;
            window.location.href = res.data;
        });
    }

    private validate() {
        if (this.createTimeGe == null) {
            this.createTimeGe = dayjs().add(-180, 'day').toDate()
        }
        if (this.createTimeLe == null) {
            this.createTimeLe = dayjs().toDate()
        }
        const startDate = dayjs(this.createTimeGe);
        const endDate = dayjs(this.createTimeLe);
        this.bodyParams.createTimeGe = startDate.format("YYYY-MM-DD HH:mm:ss");
        this.bodyParams.createTimeLe = endDate.format("YYYY-MM-DD HH:mm:ss");
        if (startDate.isAfter(endDate)) {
            this.message.warning("日期开始时间不能超过结束时间");
            return false;
        }
        if (startDate.add(180, "day").isBefore(endDate)) {
            this.message.warning("选择的日期范围不能超过180天");
            return false;
        }
        return true;
    }
}