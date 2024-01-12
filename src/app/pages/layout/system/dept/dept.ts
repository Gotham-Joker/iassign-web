import {Component, OnInit} from '@angular/core';
import {DeptService} from "./dept.service";
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NgFor, NgIf} from '@angular/common';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzSpinModule} from 'ng-zorro-antd/spin';

@Component({
    selector: 'app-dept',
    templateUrl: './dept.html',
    standalone: true,
    imports: [NzSpinModule, NzCardModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzButtonModule, NzWaveModule, NzIconModule, NzTableModule, NgFor, NzDividerModule, NzPopconfirmModule, NzModalModule, ReactiveFormsModule, NgIf]
})
export class Dept implements OnInit {
    queryParams: any = {
        page: 1,
        size: 10
    };
    list: any[] = [];
    total: number = 0;
    loading: boolean = false;
    visible: boolean = false;
    form: FormGroup;
    isEdit: boolean = false; // 是否是编辑

    constructor(private deptSvc: DeptService, private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            'id': [''],
            'deptId': ['', [Validators.required]],
            'deptCode': ['', [Validators.required]],
            'deptTw': ['', [Validators.required]]
        })
        this.query();
    }

    query(page?: any) {
        if (page) {
            this.queryParams.page = page;
        }
        this.loading = true;
        this.deptSvc.query(this.queryParams).subscribe(res => {
            this.list = res.data.list;
            this.queryParams.page = res.data.page;
            this.queryParams.size = res.data.size;
            this.total = res.data.total;
            this.loading = false;
        });
    }

    remove(id: any) {
        this.loading = true;
        this.deptSvc.remove(id).subscribe(res => {
            this.query();
        });
    }

    saveOrUpdate() {
        this.loading = true;
        // 表单校验
        if (!this.form.valid) {
            Object.values(this.form.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true})
                }
            })
            this.loading = false;
        } else {
            this.deptSvc.saveOrUpdate(this.form.value).subscribe(res => {
                this.query();
                this.visible = false;
            });
        }
    }

    openAdd() {
        this.isEdit = false;
        this.form.reset();
        this.visible = true;
    }

    edit(item) {
        this.isEdit = true;
        this.form.patchValue(item)
        this.visible = true;
    }
}
