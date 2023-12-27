import {Component, OnInit} from '@angular/core';
import {ProcessService} from "../process.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzPresetColor} from "ng-zorro-antd/core/color";
import * as dayjs from "dayjs";
import {DictPipe} from '../../../../core/dictionary/dict.pipe';
import {RouterLink} from '@angular/router';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {DatePipe, NgFor} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {OnReuseRetrieve} from "../../../../core/route-reuse";

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.html',
    styleUrls: ['./todo-list.scss'],
    standalone: true,
    imports: [NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzDatePickerModule, NzButtonModule, NzWaveModule, NzIconModule, NgFor, NzTagModule, RouterLink, DictPipe, DatePipe, NzTableModule, NzSpinModule]
})
export class TodoList implements OnInit,OnReuseRetrieve {
    loading: boolean = false; // 整个页面加载中
    list: any[] = [];
    queryParams: any = {
        page: 1,
        size: 10,
        starter: '',
        instanceId: ''
    }
    createTime_le: any;
    createTime_ge: any;
    total: number = 0;

    constructor(private processSvc: ProcessService, private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.query(1)
    }


    query(page?:number) {
        if (page) {
            this.queryParams.page = page;
        }
        this.loading = true;
        this.queryParams.createTime_le = this.formatDate(this.createTime_le);
        this.queryParams.createTime_ge = this.formatDate(this.createTime_ge);
        // 查询
        this.processSvc.queryTodo(this.queryParams).subscribe((res: any) => {
            this.list = res.data.list;
            this.total = res.data.total;
            this.queryParams.page = res.data.page;
            this.loading = false;
        });
    }

    private formatDate(date: any) {
        if (date != null && date != '') {
            return dayjs(date).format('YYYY-MM-DD');
        } else {
            return '';
        }
    }

    onReuseRetrieve(): void {
        this.query();
    }

}
