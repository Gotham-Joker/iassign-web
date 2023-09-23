import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DyformService} from "../dyform.service";
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {DyForm} from '../../../../dy-form/dy-form';
import {NzCardModule} from 'ng-zorro-antd/card';
import {Backward} from '../../../../core/components/backward/backward';
import {StartupService} from "../../../../core/startup.service";

@Component({
    selector: 'app-form-preview',
    templateUrl: './form-preview.html',
    styleUrls: ['form-preview.scss'],
    standalone: true,
    imports: [Backward, NzCardModule, DyForm, NzButtonModule, NzWaveModule]
})
export class FormPreview implements OnInit {
    data: any = {
        id: '',
        name: '',
        description: '',
        children: [],
        context: {}// 上下文，用来存放可以取值的变量
    };

    constructor(protected formSvc: DyformService, protected startupSvc: StartupService,
                protected router: Router, protected route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = params.id;
            this.formSvc.queryById(id).subscribe(res => {
                const userInfo = this.startupSvc.userInfo;
                this.data = JSON.parse(res.data.definition);
                this.data.context = {}
                this.data.context['USER_ID'] = userInfo.id;
                this.data.context['DEPT_ID'] = userInfo.deptId;
            })
        })
    }

    backward() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}
