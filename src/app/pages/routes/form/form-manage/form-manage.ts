import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {DyformService} from "../dyform.service";
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NgFor} from '@angular/common';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {OnReuseRetrieve} from "../../../../core/route-reuse";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {mergeMap, Observable, of} from "rxjs";
import {AclDirective} from "../../../../core/acl/acl.directive";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-form-manage',
    templateUrl: './form-manage.html',
    styleUrls: ['./form-manage.scss'],
    standalone: true,
    imports: [NzSpinModule, NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzButtonModule, NzWaveModule, NzIconModule, RouterLink, NzTableModule, NgFor, NzDividerModule, NzPopconfirmModule, NzUploadModule, AclDirective]
})
export class FormManage implements OnInit, OnReuseRetrieve {

    queryParams: any = {
        page: 1,
        size: 10,
        id: "",
        flag: "",
        createTime_odd: "1"
    };
    list: any[] = [];
    total: number = 0;  // 数据总条数
    // 整个页面加载中
    loading: boolean = false;
    upload = (file, fileList): Observable<boolean> => {
        return this.formSvc.upload(file).pipe(mergeMap(res => {
            this.message.success("导入成功");
            this.query();
            return of(false);
        }))
    };

    constructor(private formSvc: DyformService, private message: NzMessageService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params["id"]) {
                this.queryParams.id = params["id"];
            }
            this.query(1)
        })
    }

    query(page?: number) {
        this.loading = true;
        if (page) { // 是否从第一页开始查询
            this.queryParams.page = page;
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

    onReuseRetrieve(): void {
        this.query();
    }

    /**
     * 导出表单
     * @param id
     */
    exportForm(id) {
        window.location.href = environment.SERVER_URL + "/api/forms/out?id=" + id + "&token=" + localStorage.getItem("token");
    }
}
