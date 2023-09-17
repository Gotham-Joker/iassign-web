import {Component, OnInit} from '@angular/core';
import {ProcessService} from "../process.service";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
    selector: 'app-process-list',
    templateUrl: './process-list.html',
    styleUrls: ['./process-list.scss'],
    standalone: true,
    imports: [NzSpinModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzButtonModule, NzWaveModule, NzIconModule, NgFor, RouterLink, NzAvatarModule, NzDividerModule]
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
