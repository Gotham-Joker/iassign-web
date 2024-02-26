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
import {NzMessageService} from "ng-zorro-antd/message";
import {ProcessService} from "../process.service";
import {DeptService} from "../../../layout/system/dept/dept.service";
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {AclDirective} from '../../../../core/acl/acl.directive';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NgFor, NgIf} from '@angular/common';
import {NzTableModule} from 'ng-zorro-antd/table';
import {RouterLink} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {StartupService} from "../../../../core/startup.service";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {mergeMap, Observable, of} from "rxjs";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-process-manage',
    templateUrl: './process-manage.html',
    styleUrls: ['./process-manage.scss'],
    standalone: true,
    imports: [NzSpinModule, NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzButtonModule, NzWaveModule, NzIconModule, RouterLink, NzTableModule, NgFor, NzAvatarModule, NzToolTipModule, NzSwitchModule, AclDirective, NzDividerModule, NzPopconfirmModule, NzModalModule, NzSelectModule, NgIf, NzUploadModule]
})
export class ProcessManage implements OnInit {

    queryParams: any = {
        page: 1,
        size: 10,
        createTime_odd: '1'
    };
    list: any[] = [];
    total: number = 0;  // 数据总条数
    loading: boolean = false;
    modal: any = {
        visible: false,
        data: {
            id: '', // 流程定义ID
            status: false,
            deptIds: [] // 选中的部门清单
        }
    }
    // 部门清单
    deptList: any[] = [];
    // 当前登录用户id
    private currentUserId: string;
    // 当前登录用户是否是管理员
    private isAdmin: boolean = false;
    upload = (file, fileList): Observable<boolean> => {
        return this.processSvc.upload(file).pipe(mergeMap(res => {
            this.message.success("导入成功");
            this.query();
            return of(false);
        }))
    };


    constructor(private processSvc: ProcessService, private message: NzMessageService,
                private deptSvc: DeptService, private startupSvc: StartupService) {
    }

    ngOnInit(): void {
        this.currentUserId = this.startupSvc.userInfo.id;
        this.isAdmin = this.startupSvc.userInfo.admin;
        this.deptSvc.query({page: 1, size: 1000}).subscribe(res => {
            this.deptList = res.data.list;
        })
        this.query()
    }

    query(page?: any) {
        this.loading = true;
        if (page) { // 是否从第一页开始查询
            this.queryParams.page = page;
        }
        // 查询
        this.processSvc.query(this.queryParams).subscribe(res => {
            this.list = res.data.list;
            this.queryParams.page = res.data.page;
            this.queryParams.size = res.data.size;
            this.total = res.data.total;
            this.loading = false;
        });
    }

    remove(id: any) { // 删除
        this.processSvc.remove(id).subscribe(() => this.query())
    }

    canQueryData(item: any) {
        if (this.isAdmin) {
            return true;
        }
        return item.managers == null || item.managers == '' || item.managers.includes(this.currentUserId);
    }

    /**
     * 导出流程定义
     * @param id
     */
    exportDef(id) {
        window.location.href = environment.SERVER_URL + "/api/process-definition/out?id=" + id + "&token=" + localStorage.getItem("token");
    }

}
