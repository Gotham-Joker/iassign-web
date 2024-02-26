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
