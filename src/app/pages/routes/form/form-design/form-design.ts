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
