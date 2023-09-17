import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {ProcessService} from "../process.service";
import {DeptService} from "../../../layout/system/dept/dept.service";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AclDirective } from '../../../../core/acl/acl.directive';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
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
    selector: 'app-process-manage',
    templateUrl: './process-manage.html',
    styleUrls: ['./process-manage.scss'],
    standalone: true,
    imports: [NzSpinModule, NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzButtonModule, NzWaveModule, NzIconModule, RouterLink, NzTableModule, NgFor, NzAvatarModule, NzToolTipModule, NzSwitchModule, AclDirective, NzDividerModule, NzPopconfirmModule, NzModalModule, NzSelectModule]
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

    constructor(private processSvc: ProcessService, private message: NzMessageService,
                private deptSvc: DeptService) {
    }

    ngOnInit(): void {
        this.deptSvc.query({page: 1, size: 1000}).subscribe(res => {
            this.deptList = res.data.list;
        })
        this.query()
    }

    query(page?: any) {
        this.loading = true;
        if (page) { // 是否从第一页开始查询
            this.queryParams.page = 1;
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

    deploy() {
        this.processSvc.deploy(this.modal.data).subscribe(res => {
            this.modal.visible = false;
            this.message.success("操作成功")
            this.query();
        })
    }

    openDeploy(item: any) {
        this.modal.data.id = item.id;
        this.modal.data.status = item.status;
        this.modal.visible = true;
        this.processSvc.findPermission(item.id).subscribe(res => {
            this.modal.data.deptIds = res.data;
        });
    }
}
