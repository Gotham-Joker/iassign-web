/*
 * MIT License
 *
 * Copyright (c) 2024 Hongtao Liu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProcessService} from "../process.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {DagDataService} from "./dag-data-service";
import {of, switchMap} from "rxjs";
import {UploadService} from "../../../../core/upload.service";
import {NgFor} from '@angular/common';
import {NzSelectModule} from 'ng-zorro-antd/select';
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
import {DAG_DATA_SVC} from "../../../../dag/dag-data-service.interface";
import {DagModule} from "../../../../dag/dag.module";
import {DagDesigner} from "../../../../dag/components/dag-designer/dag-designer";


@Component({
    selector: 'app-process-design',
    templateUrl: './process-design.html',
    providers: [
        // 加载用户、角色等数据
        {provide: DAG_DATA_SVC, useClass: DagDataService, deps: [HttpClient]}
    ],
    standalone: true,
    imports: [DagModule, NzModalModule, NzFormModule, FormsModule, ReactiveFormsModule, NzGridModule, NzAvatarModule, NzDividerModule, NzUploadModule, NzButtonModule, NzWaveModule, NzIconModule, NzInputModule, NzSelectModule, NgFor]
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
    formOptions: any[] = [];

    constructor(private route: ActivatedRoute, private processSvc: ProcessService,
                private uploadSvc: UploadService, private message: NzMessageService, private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            "id": [''],
            "name": ['', Validators.required]
        })
        this.route.queryParams.subscribe(res => {
            if (res["id"]) {
                this.processSvc.queryById(res["id"]).subscribe(res => {
                    const process = res.data;
                    this.form.patchValue({
                        id: process.id, name: process.name
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
