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

import {Component, EventEmitter, Output} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NgFor } from '@angular/common';

@Component({
    selector: 'dag-node-panel',
    templateUrl: './node-panel.html',
    styleUrls: ['./node-panel.scss'],
    standalone: true,
    imports: [NgFor, NzToolTipModule, NzButtonModule, NzIconModule]
})
export class NodePanel {
    @Output()
    nodeDrag: EventEmitter<any> = new EventEmitter<any>();
    nodes: any[] = [
        {key: 'start-node', icon: 'svg:start', label: '开始'},
        {key: 'user-task-node', icon: 'svg:user_task', label: '审批'},
        {key: 'gateway-node', icon: 'svg:gateway', label: '网关'},
        {key: 'system-node', icon: 'svg:system', label: '系统'},
        {key: 'end-node', icon: 'svg:end', label: '结束'}
    ]


    handleDragStart($event: DragEvent, key: string) {
        this.nodeDrag.emit(key);
    }
}
