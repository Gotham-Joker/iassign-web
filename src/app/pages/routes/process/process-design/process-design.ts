import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProcessService} from "../process.service";
import {NzMessageModule, NzMessageService} from "ng-zorro-antd/message";
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {DagDataService} from "./dag-data-service";
import {of, switchMap} from "rxjs";
import {UploadService} from "../../../../core/upload.service";
import {DAG_DATA_SVC} from "../../../../dag/dag-data-service.interface";
import {DagDesigner} from "../../../../dag/components/dag-designer/dag-designer";
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzModalModule} from 'ng-zorro-antd/modal';


@Component({
    selector: 'app-process-design',
    templateUrl: './process-design.html',
    providers: [
        // 加载用户、角色等数据
        {provide: DAG_DATA_SVC, useClass: DagDataService, deps: [HttpClient]}
    ],
    standalone: true,
    imports: [DagDesigner, NzModalModule, NzFormModule, FormsModule, ReactiveFormsModule, NzGridModule,
        NzAvatarModule, NzDividerModule, NzUploadModule, NzButtonModule, NzWaveModule, NzIconModule, NzInputModule, NzMessageModule]
})
export class ProcessDesign implements OnInit {
    @ViewChild("designer", {read: DagDesigner})
    designer: DagDesigner;
    visible: boolean = false;
    data: any;
    form: FormGroup;
    upload = (file, fileList) => {
        return this.uploadSvc.upload(file).pipe(switchMap((res) => {
            const url = res["data"].url
            this.form.patchValue({icon: url})
            return of(false);
        }));
    };


    constructor(private route: ActivatedRoute, private processSvc: ProcessService,
                private uploadSvc: UploadService,
                private message: NzMessageService, private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            "id": [''],
            "name": ['', Validators.required],
            "description": ['', Validators.required],
            "groupName": ['', Validators.required],
            "seqNo": ['', Validators.required],
            "icon": [''],
            "formId": ['']
        })
        this.route.queryParams.subscribe(res => {
            if (res["id"]) {
                this.processSvc.queryById(res["id"]).subscribe(res => {
                    const process = res.data;
                    this.form.patchValue({
                        id: process.id, name: process.name,
                        seqNo: process.seqNo, icon: process.icon,
                        description: process.description, formId: process.formId, groupName: process.groupName
                    });
                    this.designer.dagContainer.resetCells(JSON.parse(res.data.dag));
                })
            }
        })
    }

    openModal($event: any) {
        this.data = $event;
        this.visible = true;
    }

    saveOrUpdate() {
        // 表单校验
        if (!this.form.valid) {
            Object.values(this.form.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true})
                }
            })
        } else {
            const value = this.form.value;
            value.dag = JSON.stringify(this.data.cells);
            this.processSvc.saveOrUpdate(value).subscribe((res: any) => {
                this.form.patchValue({id: res.data}) // 回填id
                this.visible = false;
                this.message.success("保存成功");
            })
        }
    }
}
