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
import {SysMessageService} from "./sys-message.service";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {EMPTY} from "rxjs";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NgFor } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {DiffTimePipe} from "../../../../core/diff-time/diff-time.pipe";
import {Backward} from "../../../../core/components/backward/backward";

@Component({
    selector: 'message',
    templateUrl: 'message.html',
    standalone: true,
    imports: [NzSpinModule, NzButtonModule, NzWaveModule, NzPopconfirmModule, NzIconModule, NzCardModule, NzTableModule, NgFor, NzAvatarModule, NzDividerModule, DiffTimePipe, Backward]
})

export class Message implements OnInit {
    loading: boolean = false;
    list: any[] = [];
    total: number = 0;
    queryParams: any = {
        page: 1,
        size: 10,
        createTime_odd: 1
    }

    constructor(private sysMessageSvc: SysMessageService, private router: Router) {
    }

    ngOnInit() {
        this.query(1);
    }

    query(page?: number) {
        if (page) {
            this.queryParams.page = page;
        }
        this.loading = true;
        this.sysMessageSvc.queryMessage(this.queryParams).pipe(catchError(err => {
            this.loading = false;
            return EMPTY;
        })).subscribe(res => {
            this.list = res.data.list;
            this.total = res.data.total;
            this.loading = false;
        })
    }

    /**
     * 删除
     * @param msgId
     */
    remove(msgId) {
        this.sysMessageSvc.markAsRead(msgId).subscribe(() => this.query());
    }

    routeToLink(instanceId) {
        this.router.navigate(['/process/process-detail'], {queryParams: {id: instanceId}});
    }

}