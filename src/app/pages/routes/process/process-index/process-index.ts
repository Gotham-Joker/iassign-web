import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import dayjs from "dayjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ProcessService} from "../process.service";
import {catchError} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd/message";
import {DictPipe} from '../../../../core/dictionary/dict.pipe';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NgFor} from '@angular/common';
import {NzTableModule} from 'ng-zorro-antd/table';
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
import {NzDividerModule} from "ng-zorro-antd/divider";

@Component({
    selector: 'process-index',
    templateUrl: 'process-index.html',
    styles: [
        `.highlight span {
          color: rgb(220, 38, 38);
        }`
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NzSpinModule, NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzSelectModule, NzDatePickerModule, NzButtonModule, NzWaveModule, NzIconModule, NzTableModule, NgFor, NzTagModule, NzToolTipModule, RouterLink, DictPipe, NzDividerModule]
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
            if (params["definitionId"]) {
                this.bodyParams.definitionId = params["definitionId"];
            }
            this.query(1);
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