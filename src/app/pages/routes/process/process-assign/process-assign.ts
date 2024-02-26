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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {StartupService} from "../../../../core/startup.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {UserService} from "../../../layout/system/user/user.service";
import {BehaviorSubject, Subject, switchMap} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {FormsModule} from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NgIf, NgFor} from '@angular/common';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzModalModule} from 'ng-zorro-antd/modal';

/**
 * 流程指派
 */
@Component({
    selector: 'app-process-assign',
    templateUrl: 'process-assign.html',
    standalone: true,
    imports: [NzModalModule, NzGridModule, NzTagModule, NgIf, NzSelectModule, FormsModule, NgFor, NzAvatarModule, NzButtonModule, NzIconModule, NzInputModule]
})
export class ProcessAssign implements OnInit {
    @Input()
    visible: boolean = false;
    @Output()
    visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedValue: any;

    isAssigning: boolean = false;

    modal: any = {
        assignRemark: ''
    };
    data: any = {
        userId: '',
        avatar: '',
        username: '',
        email: '',
        remark: ''
    };
    @Output()
    onAssign: EventEmitter<any> = new EventEmitter<any>();

    // 指派用户的头像
    avatar: string = '';
    options: any[] = []
    nzFilterOption = (): boolean => true;
    $searchChange: Subject<any> = new BehaviorSubject(null);


    constructor(protected startupSvc: StartupService,
                private userSvc: UserService,
                private message: NzMessageService) {
    }

    ngOnInit() {
        this.$searchChange.asObservable().pipe(debounceTime(500))
            .pipe(switchMap(params => {
                return this.userSvc.query(params)
            })).subscribe(res => {
            this.options = res.data.list;
        });
    }

    assign() {
        if (this.modal.assignRemark != null && this.modal.assignRemark.trim() != '') {
            this.changeAssignRemark();
        }
        this.isAssigning = false;
        // 校验
        if (!this.data.userId || !this.data.email || !this.data.username) {
            this.message.warning("请决定要指派的用户")
            return;
        }
        this.onAssign.emit(this.data);
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    /**
     * 添加指派备注
     */
    changeAssignRemark() {
        this.data.remark = this.modal.assignRemark;
        this.modal.assignRemark = '';
    }

    hide() {
        this.isAssigning = false;
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    search($event: string) {
        if (!$event) { // 空
            this.options = [];
            return;
        }

        const params = {page: 1, size: 10};
        if (/\w+/.test($event)) {
            params['email_like'] = $event;
        } else {
            params['username_like'] = $event;
        }
        // 只能查询自己部门的
        params['deptId'] = this.startupSvc.userInfo['deptId'];
        this.$searchChange.next(params);
    }

    /**
     * 确定
     */
    confirm(user) {
        if (user == null) {
            return;
        }
        this.data.userId = user.id;
        this.data.avatar = user.avatar;
        this.data.username = user.username;
        this.data.email = user.email;
        this.avatar = user.avatar;
        this.isAssigning = false;
    }

}