import {Component, OnInit} from '@angular/core';
import {LayoutService} from "./layout.service";
import {ChildrenOutletContexts, RouterOutlet} from "@angular/router";
import {zoomFadeAnimation} from "../../core/animations";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.html',
    styleUrls: ['./layout.scss'],
    animations: [zoomFadeAnimation]
})
export class Layout implements OnInit {
    isCollapsed: boolean = false;

    constructor(private layoutSvc: LayoutService, private contexts: ChildrenOutletContexts) {
    }

    ngOnInit(): void {

    }


    collapsedChange($event: boolean) {
        this.isCollapsed = $event;
        this.layoutSvc.next($event);
    }

    prepareRoute(outlet: RouterOutlet) {
        return this.contexts.getContext("primary")?.route?.snapshot?.data['breadcrumb'];
    }
}
