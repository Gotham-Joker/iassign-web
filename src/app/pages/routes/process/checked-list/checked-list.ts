/*
 * MIT License
 *
 * Copyright (c) 2024 Hongtao Liu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {Component, OnInit} from '@angular/core';
import {ProcessService} from "../process.service";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzCardModule} from "ng-zorro-antd/card";
import {FormsModule} from "@angular/forms";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzTagModule} from "ng-zorro-antd/tag";
import {RouterLink} from "@angular/router";
import dayjs from "dayjs";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {IconsProviderModule} from "../../../../core/ng-zorro/icons-provider.module";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {AclDirective} from "../../../../core/acl/acl.directive";
import {DatePipe, NgForOf} from "@angular/common";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {DictPipe} from "../../../../core/dictionary/dict.pipe";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

/**
 * 已办事项清单
 */
@Component({
    selector: 'checked-list',
    templateUrl: 'checked-list.html',
    standalone: true,
    imports: [
        NzFormModule,
        NzCardModule,
        FormsModule,
        NzDatePickerModule,
        NzTagModule,
        RouterLink,
        NzButtonModule,
        NzInputModule,
        IconsProviderModule,
        NzSpinModule,
        AclDirective,
        NgForOf,
        NzAvatarModule,
        NzDividerModule,
        NzPopconfirmModule,
        NzSwitchModule,
        NzTableModule,
        NzToolTipModule,
        DatePipe,
        DictPipe
    ]
})

export class CheckedList implements OnInit {
    queryParams: any = {
        page: 1,
        size: 10,
        instanceId: ''
    };
    list: any[] = [];
    total: number = 0;
    loading: boolean = false;
    auditTime_ge: any = dayjs().add(-6, 'month').toDate();
    auditTime_le: any = dayjs().toDate();

    constructor(private processSvc: ProcessService, private message: NzMessageService) {
    }

    ngOnInit() {
        this.query(1);
    }

    query(page?: number) {
        if (page) {
            this.queryParams.page = page;
        }
        if (this.auditTime_ge != null && this.auditTime_ge != '') {
            this.queryParams.createTimeGe = dayjs(this.auditTime_ge).format('YYYY-MM-DD') + " 00:00:00";
        } else {
            this.queryParams.createTimeGe = '';
        }
        if (this.auditTime_le != null && this.auditTime_le != '') {
            this.queryParams.createTimeLe = dayjs(this.auditTime_le).format('YYYY-MM-DD') + " 23:59:59";
        } else {
            this.queryParams.createTimeLe = '';
        }
        this.loading = true;
        this.processSvc.checkedList(this.queryParams).subscribe(res => {
            this.list = res.data.list;
            this.total = res.data.total;
            this.loading = false;
        })
    }

    /**
     * 尝试取回
     */
    reclaim(item: any) {
        this.loading = true;
        this.processSvc.reclaim(item.taskId).pipe(catchError(err => {
            this.loading = false;
            return throwError(err)
        })).subscribe(res => {
            this.query();
            this.message.success("取回成功");
        });
    }
}