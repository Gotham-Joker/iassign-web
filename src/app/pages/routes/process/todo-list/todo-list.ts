import {Component, OnInit} from '@angular/core';
import {ProcessService} from "../process.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzPresetColor} from "ng-zorro-antd/core/color";
import * as dayjs from "dayjs";

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.html',
    styleUrls: ['./todo-list.scss']
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
