import {Component, OnInit} from '@angular/core';
import {ProcessService} from "../process.service";

@Component({
    selector: 'app-process-list',
    templateUrl: './process-list.html',
    styleUrls: ['./process-list.scss']
})
export class ProcessList implements OnInit {
    loading: boolean = false;
    keyword: string = '';
    group: any = {};
    total: number = 0;
    list: string[];


    constructor(private processSvc: ProcessService) {
    }

    ngOnInit(): void {
        this.query();
    }

    query() {
        this.loading = true;
        this.processSvc.currentUserDefinitions(this.keyword).subscribe(res => {
            this.group = res.data;
            this.list = Object.keys(this.group);
            this.loading = false;
        });
    }


}
