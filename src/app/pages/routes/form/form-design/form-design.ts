import {Component, OnInit, ViewChild} from '@angular/core';
import {DyformService} from "../dyform.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute} from "@angular/router";
import {FormsDesigner} from "../../../../dy-form/forms-designer";

@Component({
    selector: 'app-form-design',
    templateUrl: './form-design.html',
    styleUrls: ['./form-design.scss'],
    standalone: true,
    imports: [FormsDesigner]
})
export class FormDesign implements OnInit {
    @ViewChild("formsDesigner", {read: FormsDesigner})
    formsDesigner: FormsDesigner

    constructor(private formSvc: DyformService, private message: NzMessageService,
                private route: ActivatedRoute) {

    }


    ngOnInit(): void {
        this.route.queryParams.subscribe(res => {
            if (res["id"]) {
                const id = res["id"];
                this.formSvc.queryById(id).subscribe(res => {
                    const config = JSON.parse(res.data.definition);
                    this.formsDesigner.parseFromJson(config);
                });
            }
        })
    }

    onSave($event: any) {
        this.formSvc.saveOrUpdate($event).subscribe(res => {
            this.message.success('保存成功');
            this.formsDesigner.closeModal()
        })
    }
}
