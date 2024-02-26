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
