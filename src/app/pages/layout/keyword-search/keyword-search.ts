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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import * as _ from "lodash";
import {Router} from "@angular/router";
import {ProcessService} from "../../routes/process/process.service";
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgIf, NgFor } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
    selector: 'app-keyword-search',
    templateUrl: './keyword-search.html',
    styleUrls: ['./keyword-search.scss'],
    // 变更检测采用手动触发
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NzPopoverModule, NzInputModule, NzButtonModule, FormsModule, NzIconModule, NzSpinModule, NgIf, NgFor, NzEmptyModule]
})
export class KeywordSearch implements OnInit {

    constructor(private router: Router,
                private cdr: ChangeDetectorRef,
                private processSvc: ProcessService) {
    }

    ngOnInit(): void {
        // 顶部搜索框，输入后延时1秒才开始搜索（节流）
        this.keywordChangeSubject.asObservable().pipe(debounceTime(1000)).subscribe(res => {
            this.keywordSearch()
        })
    }

    trigger: any = null;
    visible = false;
    fetching = false;
    // 搜索框的值
    keyword = '';
    keywordChangeSubject: Subject<any> = new Subject();
    list: any[] = [];

    /**
     * 关键字搜索
     * 目前支持cif，客户姓名
     */
    keywordChange() {
        if (!_.isEmpty(this.keyword)) {
            this.keywordChangeSubject.next('');
        }
    }

    /**
     * 点击弹出层外部关闭弹出层
     * @param $event
     */
    changeTrigger($event: boolean) {
        if (!$event) {
            this.trigger = null;
        } else {
            this.trigger = 'click';
        }
        this.cdr.detectChanges();
    }

    /**
     * 立即搜索
     */
    keywordSearch() {
        if (!_.isEmpty(this.keyword)) {
            this.fetching = true;
            this.visible = true;
            this.trigger = 'click';
            this.cdr.detectChanges();
            this.processSvc.queryInstance({page: 1, size: 1, id: this.keyword}).subscribe(res => {
                this.list = res.data.list;
                this.fetching = false;
                this.cdr.detectChanges();
            })
        }
    }

    /**
     * 跳转到详情页
     * @param id
     */
    routeToDetails(id: string) {
        this.visible = false;
        this.cdr.detectChanges();
        this.router.navigate(['/process/process-detail'], {queryParams: {id: id}});
    }
}
