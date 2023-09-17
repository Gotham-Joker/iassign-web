import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {ProcessService} from "../process.service";
import {DyformService} from "../../form/dyform.service";
import {DyForm} from "../../../../dy-form/dy-form/dy-form";
import {StartupService} from "../../../../core/startup.service";
import {UserService} from "../../../layout/system/user/user.service";
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MailSelect } from '../../../../core/components/mail-select/mail-select';
import { NgIf } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Backward } from '../../../../core/components/backward/backward';

@Component({
    selector: 'app-process-start',
    templateUrl: './process-start.html',
    styleUrls: ['./process-start.scss'],
    standalone: true,
    imports: [Backward, NzCardModule, NzStepsModule, NzSpinModule, NgIf, MailSelect, DyForm, NzButtonModule, NzWaveModule, NzResultModule, RouterLink]
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
    emails: string[] = []; // 邮件接收人
    definitionId: string = '';
    formId: string = '';
    loading: boolean = false;
    current: number = 0;
    instanceId: string = ""; // 申请单号
    userList: any[] = []

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
                this.formSvc.queryById(this.formId).subscribe(res => {
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
        // 校验填写的表单
        if (this.dynamicForm.validate()) {
            this.loading = true;
            const data = {
                definitionId: this.definitionId,
                formData: this.dynamicForm.form,
                emails: this.emails.join(",")
            }
            this.processSvc.startInstance(data).subscribe(res => {
                this.instanceId = res.data;
                this.current = 1;
                this.loading = false;
            });
        }
    }

    /**
     * 再次申请
     */
    reapply() {
        this.instanceId = "";
        this.current = 0;
    }

}
