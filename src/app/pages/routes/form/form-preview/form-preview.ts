import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DyformService} from "../dyform.service";

@Component({
    selector: 'app-form-preview',
    templateUrl: './form-preview.html',
    styleUrls: ['form-preview.scss']
})
export class FormPreview implements OnInit {
    data: any = {
        id: '',
        name: '',
        description: '',
        children: []
    };
    constructor(protected formSvc: DyformService, protected router: Router,
                protected route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = params.id;
            this.formSvc.queryById(id).subscribe(res => {
                this.data = JSON.parse(res.data.definition);
            })
        })
    }

    backward() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}
