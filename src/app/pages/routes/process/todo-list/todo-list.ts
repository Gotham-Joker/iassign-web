import {Component, OnInit} from '@angular/core';
import {ProcessService} from "../process.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzPresetColor} from "ng-zorro-antd/core/color";
import * as dayjs from "dayjs";
import { DictPipe } from '../../../../core/dictionary/dict.pipe';
import { RouterLink } from '@angular/router';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NgFor } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.html',
    styleUrls: ['./todo-list.scss'],
    standalone: true,
    imports: [NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzDatePickerModule, NzButtonModule, NzWaveModule, NzIconModule, NgFor, NzTagModule, RouterLink, DictPipe]
})
export class TodoList implements OnInit {
    loading: boolean = false; // 整个页面加载中
    nzColors: NzPresetColor[] = ["pink", "red", "yellow", "orange", "cyan", "green", "blue", "purple",
        "geekblue", "magenta", "volcano", "gold", "lime"];

    list: any[] = [];
    queryParams: any = {
        starter: '',
        instanceId: ''
    }
    createTime_le: any;
    createTime_ge: any;

    constructor(private processSvc: ProcessService, private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.query()
    }


    query() {
        this.loading = true;
        this.queryParams.createTime_le = this.formatDate(this.createTime_le);
        this.queryParams.createTime_ge = this.formatDate(this.createTime_ge);
        // 查询
        this.processSvc.queryTodo(this.queryParams).subscribe((res: any) => {
            this.list = res.data;
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

}
