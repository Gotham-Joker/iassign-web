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

    constructor(private processSvc: ProcessService) {
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
}