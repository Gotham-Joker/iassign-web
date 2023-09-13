import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StartupService} from "../../../core/startup.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.html',
    styleUrls: ['./sidebar.scss']
})
export class Sidebar implements OnInit {
    @Input()
    collapsed: boolean = true;
    @Output()
    collapsedChange: EventEmitter<boolean> = new EventEmitter();

    userInfo: any;
    menus: any;

    constructor(private startupSvc: StartupService) {
    }

    ngOnInit(): void {
        this.userInfo = this.startupSvc.userInfo || {};
        this.menus = this.startupSvc.menus || [];
    }

    toggleExpand() { // 菜单折叠状态变更
        // this.collapsed = !this.collapsed;
        this.collapsedChange.emit(!this.collapsed);
    }

}
