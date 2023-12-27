import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ProcessService} from "../process.service";
import {DyformService} from "../../form/dyform.service";
import {DyForm} from "../../../../dy-form/dy-form";
import {StartupService} from "../../../../core/startup.service";
import {UserService} from "../../../layout/system/user/user.service";
import {catchError} from "rxjs/operators";
import {EMPTY, timer} from "rxjs";
import {NzResultModule} from 'ng-zorro-antd/result';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {MailSelect} from '../../../../core/components/mail-select/mail-select';
import {NgIf} from '@angular/common';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzStepsModule} from 'ng-zorro-antd/steps';
import {NzCardModule} from 'ng-zorro-antd/card';
import {Backward} from '../../../../core/components/backward/backward';
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzIconModule} from "ng-zorro-antd/icon";
import {DagModule} from "../../../../dag/dag.module";
import {DagContainer} from "../../../../dag/components/dag-container/dag-container";

@Component({
    selector: 'app-process-start',
    templateUrl: './process-start.html',
    styleUrls: ['./process-start.scss'],
    standalone: true,
    imports: [Backward, NzCardModule, NzStepsModule, NzSpinModule, NgIf, MailSelect, DyForm, NzButtonModule, NzWaveModule, NzResultModule, RouterLink, NzModalModule, DagModule, NzIconModule]
})
export class ProcessStart implements OnInit {
    data: any = {
        id: '',
        name: '',
        description: '',
        children: []
    };
    @ViewChild("dynamicForm", {read: DyForm})
    dynamicForm: DyForm;
    @ViewChild("dagContainer", {read: DagContainer})
    dagContainer: DagContainer;

    emails: string[] = []; // 邮件接收人
    definitionId: string = '';
    formId: string = '';
    loading: boolean = false;
    current: number = 0;
    instanceId: string = ""; // 申请单号
    userList: any[] = []
    visible: boolean = false;
    dag: any;

    constructor(protected formSvc: DyformService,
                protected processSvc: ProcessService,
                protected startupSvc: StartupService,
                protected userSvc: UserService,
                protected router: Router,
                protected route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.definitionId = params.id;
            this.formId = params.formId;
            this.userSvc.query({page: 1, size: 10000, deptId_oda: 1}).subscribe(res => this.userList = res.data.list);
            if (this.formId) {
                this.formSvc.queryDefContext(this.formId).subscribe(res => {
                    this.data = JSON.parse(res.data.definition);
                });
            }
            const email = this.startupSvc.userInfo['email'];
            if (email != null && /\w+@[0-9a-zA-Z.]+/.test(email)) {
                this.emails = [email];
            }
        })
    }

    /**
     * 启动流程实例
     */
    startProcess() {
        this.loading = true;
        // 校验填写的表单
        if (this.dynamicForm.validate()) {
            // this.loading = true;
            const data = {
                definitionId: this.definitionId,
                formData: this.dynamicForm.data(),
                emails: this.emails.join(",")
            }
            this.processSvc.startInstance(data).pipe(catchError(err => {
                this.loading = false;
                return EMPTY;
            })).subscribe(res => {
                this.instanceId = res.data;
                this.current = 1;
                this.loading = false;
            });
        } else {
            this.loading = false;
        }
    }

    /**
     * 再次申请
     */
    reapply() {
        this.instanceId = "";
        this.current = 0;
    }

    /**
     * 流程预览
     */
    viewGraph() {
        this.visible = true;
        if (this.dag == null) {
            this.processSvc.dag(this.definitionId).subscribe(res => {
                this.dag = JSON.parse(res.data);
                this.dagContainer.resetCells(this.dag);
            });
        } else {
            timer(0).subscribe(res => {
                this.dagContainer.resetCells(this.dag);
            })
        }
    }
}
