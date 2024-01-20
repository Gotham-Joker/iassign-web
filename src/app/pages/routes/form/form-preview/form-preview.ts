import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DyformService} from "../dyform.service";
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {DyForm} from '../../../../dy-form/dy-form';
import {NzCardModule} from 'ng-zorro-antd/card';
import {Backward} from '../../../../core/components/backward/backward';
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
    selector: 'app-form-preview',
    templateUrl: './form-preview.html',
    styleUrls: ['form-preview.scss'],
    standalone: true,
    imports: [Backward, NzCardModule, DyForm, NzButtonModule, NzWaveModule]
})
export class FormPreview implements OnInit {
    @ViewChild("dynamicForm", {read: DyForm})
    dynamicForm: DyForm;

    data: any = {
        id: '',
        name: '',
        description: '',
        children: []
    };

    constructor(protected formSvc: DyformService, protected router: Router,
                protected route: ActivatedRoute, private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = params.id;
            this.formSvc.queryDefContext(id).subscribe(res => {
                this.data = JSON.parse(res.data.definition);
            })
        })
    }

    backward() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    /**
     * 模拟提交
     */
    mockSubmit() {
        if (this.dynamicForm.validate()) {
            this.message.success("模拟提交成功");
        }
    }
}
