import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StartupService} from "../../../core/startup.service";
import {RouterLink} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NgIf, NgFor} from '@angular/common';
import {NzLayoutModule} from 'ng-zorro-antd/layout';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.html',
    styleUrls: ['./sidebar.scss'],
    standalone: true,
    imports: [NzLayoutModule, NgIf, NzToolTipModule, NzMenuModule, NgFor, NzButtonModule, RouterLink]
})
export class Sidebar implements OnInit {
    @Input()
    collapsed: boolean = true;
    @Output()
    collapsedChange: EventEmitter<any> = new EventEmitter<any>();

    userInfo: any;
    menus: any;

    constructor(private startupSvc: StartupService) {
    }

    ngOnInit(): void {
        this.userInfo = this.startupSvc.userInfo || {};
        this.menus = this.startupSvc.menus || [];
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedChange.emit(this.collapsed);
    }
}
