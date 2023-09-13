import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {ProcessService} from "../process.service";
import {DeptService} from "../../../layout/system/dept/dept.service";

@Component({
    selector: 'app-process-manage',
    templateUrl: './process-manage.html',
    styleUrls: ['./process-manage.scss']
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
