import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {DyformService} from "../dyform.service";
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NgFor } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
    selector: 'app-form-manage',
    templateUrl: './form-manage.html',
    styleUrls: ['./form-manage.scss'],
    standalone: true,
    imports: [NzSpinModule, NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzButtonModule, NzWaveModule, NzIconModule, RouterLink, NzTableModule, NgFor, NzDividerModule, NzPopconfirmModule]
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
