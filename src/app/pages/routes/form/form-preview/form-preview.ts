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
