import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {FormBuilder, Validators} from "@angular/forms";
import {MenuService} from "./menu.service";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.html'
})
export class Menu implements OnInit {

    queryParams: any = {
        page: 1,
        size: 10,
        weight_oda: '1'
    };
    list: any[] = [];
    total: number = 0;
    loading: boolean = false;

    modal: any = { // 编辑框
        title: '编辑',
        loading: false,
        visible: false,
        form: null
    };
    parents: any[] = [];

    constructor(private menuSvc: MenuService, private message: NzMessageService,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.initModalForm();
        this.findParents();
        this.query();
    }

    query(pageOne?: boolean) {
        if (pageOne) {
            this.queryParams.page = 1;
        }
        this.loading = true;
        this.menuSvc.query(this.queryParams).subscribe(res => {
            this.list = res.data.list;
            this.queryParams.page = res.data.page;
            this.queryParams.size = res.data.size;
            this.total = res.data.total;
            this.loading = false;
        });
    }

    remove(id: any) {
        this.menuSvc.remove(id).subscribe(res => {
            this.query();
        });
    }

    pageChange($event: number) {
        this.queryParams.page = $event;
        this.query();
    }

    save() {
        // 表单校验
        if (!this.isValid()) {
            return;
        }
        this.modal.loading = true;
        const data = this.modal.form.value;
        this.menuSvc.saveOrUpdate(data).subscribe(res => {
            this.modal.loading = false;
            this.modal.visible = false;
            this.query();
        });
    }

    /**
     * 校验表单
     */
    private isValid(): boolean {
        if (!this.modal.form.valid) {
            Object.values(this.modal.form.controls).forEach((control: any) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true})
                }
            });
            return false;
        }
        return true;
    }

    /**
     * 初始化选择框可选数据
     */
    private findParents() {
        this.menuSvc.findParents().subscribe(res => {
            this.parents = res.data;
        });
    }

    /**
     * 初始化弹窗表单
     */
    private initModalForm() {
        this.modal.form = this.fb.group({
            'id': [null],
            'pid': [null, Validators.required],
            'weight': [null, Validators.required],
            'text': [null, Validators.required],
            'icon': [null],
            'link': [null],
            'allAvailable': [false]
        });
    }

    edit(obj: any) {
        if (obj) {
            this.modal.title = '编辑';
            this.modal.form.patchValue(obj);
        } else {
            this.modal.title = '新增';
            this.modal.form.reset({pid: 0, weight: 10000, allAvailable: false}); // 重置表单
        }
        this.modal.visible = true;
    }
}
