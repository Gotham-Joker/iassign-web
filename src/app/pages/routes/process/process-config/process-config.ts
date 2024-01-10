import {Component, OnInit} from '@angular/core';
import {Backward} from "../../../../core/components/backward/backward";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {UploadService} from "../../../../core/upload.service";
import {mergeMap, Observable, of, throwError} from "rxjs";
import {NgForOf} from "@angular/common";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {FormsModule} from "@angular/forms";
import {DeptService} from "../../../layout/system/dept/dept.service";
import {ActivatedRoute} from "@angular/router";
import {ProcessService} from "../process.service";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {catchError} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzRadioModule} from "ng-zorro-antd/radio";

@Component({
    selector: 'process-config',
    templateUrl: 'process-config.html',
    standalone: true,
    styleUrls: ['../../user-profile/user-profile.scss'],
    imports: [
        Backward,
        NzTabsModule,
        NzCardModule,
        NzInputModule,
        NzAvatarModule,
        NzFormModule,
        NzButtonModule,
        NzDividerModule,
        NzIconModule,
        NzUploadModule,
        NzWaveModule,
        NgForOf,
        NzSelectModule,
        NzSwitchModule,
        FormsModule,
        NzSpinModule,
        NzRadioModule
    ]
})

export class ProcessConfig implements OnInit {
    data: any = {};
    upload = (file, fileList): Observable<boolean> => {
        return this.uploadSvc.upload(file).pipe(mergeMap(res => {
            // 拿到url后保存
            const data = {id: this.id, icon: res.data.url}
            if (data.id) {
                this.processSvc.saveOrUpdate(data).pipe(this.catchErr()).subscribe(res => {
                    this.data.icon = data.icon;
                    this.message.success("更换应用图标成功");
                })
            }
            return of(false);
        }))
    };
    deptList: any[] = []
    private id: string;
    loading: boolean = false;
    deployStatus: boolean = false;

    constructor(private uploadSvc: UploadService, private deptSvc: DeptService, private route: ActivatedRoute,
                private processSvc: ProcessService, private message: NzMessageService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params["id"]) {
                this.id = params["id"];
                // 查找流程详情
                this.processSvc.findDefinitionDetail(this.id).subscribe(res => {
                    this.data = res.data;
                    this.deployStatus = res.data.status; // 部署状态单独取出
                })
            }
        })
        this.deptSvc.query({page: 1, size: 1000}).subscribe(res => {
            this.deptList = res.data.list;
        })
    }


    saveBase() {
        this.loading = true;
        // 复制基本属性，更新
        const data = {
            id: this.id, name: this.data.name,
            formId: this.data.formId, groupName: this.data.groupName,
            seqNo: this.data.seqNo, description: this.data.description,
            returnable: this.data.returnable
        };
        this.processSvc.saveOrUpdate(data).pipe(this.catchErr()).subscribe(res => {
            this.message.success("保存成功");
            this.loading = false;
        });
    }

    deploy() {
        this.loading = true;
        // 复制部署属性，更新
        const data = {id: this.id, status: this.deployStatus, managers: this.data.managers};
        this.processSvc.saveOrUpdate(data).pipe(mergeMap(res => {
            const deployData = {id: this.id, deptIds: this.data.deptIds}
            return this.processSvc.deploy(deployData);
        }), this.catchErr()).subscribe(res => {
            this.message.success("保存成功");
            this.loading = false;
        });
    }

    /**
     * 捕获异常时关闭loading
     * @private
     */
    private catchErr() {
        return catchError(err => {
            this.loading = false;
            return throwError(err);
        })
    }

    /**
     * 保存fallback
     */
    saveFallback() {
        this.loading = true;
        const data = {
            id: this.id, fallback: this.data.fallback
        };
        this.processSvc.saveOrUpdate(data).pipe(this.catchErr()).subscribe(res => {
            this.message.success("保存成功");
            this.loading = false;
        });
    }
}