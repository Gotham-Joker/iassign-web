import {Component, OnInit} from '@angular/core';
import {LayoutService} from "./layout.service";
import {ChildrenOutletContexts, RouterOutlet} from "@angular/router";
import {zoomFadeAnimation} from "../../core/animations";
import {Header} from './header/header';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NgClass} from '@angular/common';
import {Sidebar} from './sidebar/sidebar';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.html',
    styleUrls: ['./layout.scss'],
    animations: [zoomFadeAnimation],
    standalone: true,
    imports: [Sidebar, NgClass, NzLayoutModule, Header, RouterOutlet]
})
export class Layout implements OnInit {
    isCollapsed: boolean = false;

    constructor(private layoutSvc: LayoutService, private contexts: ChildrenOutletContexts) {
    }

    ngOnInit(): void {

    }


    collapsedChange() {
        this.isCollapsed = !this.isCollapsed;
        this.layoutSvc.next(this.isCollapsed);
    }

    prepareRoute(outlet: RouterOutlet) {
        return this.contexts.getContext("primary")?.route?.snapshot?.data['breadcrumb'];
    }
}
