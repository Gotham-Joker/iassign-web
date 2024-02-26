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

import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DagContainer} from "../dag-container/dag-container";
import { NodePanel } from '../node-panel/node-panel';
import { NgStyle } from '@angular/common';
import { Toolbar } from '../toolbar/toolbar';

@Component({
    selector: 'dag-designer',
    templateUrl: './dag-designer.html',
    standalone: true,
    imports: [Toolbar, NgStyle, DagContainer, NodePanel]
})
export class DagDesigner implements OnInit {
    @ViewChild('dagContainer', {read: DagContainer, static: true})
    dagContainer: DagContainer;
    @ViewChild('ele', {read: ElementRef, static: true})
    ele: ElementRef;

    dragNodeKey: string;
    @Output()
    onSave: EventEmitter<any> = new EventEmitter<any>();
    // 从拖拽面板拖拽组件出来时，记下来组件的类型
    containerHeight: any = '0px';

    constructor() {
    }

    ngOnInit(): void {
        // 既然是static的，那就不用等到timer再去获取高度了
        this.containerHeight = this.ele.nativeElement.clientHeight - 33 + 'px'
    }


    // 判断是否允许放置，一律允许

    handleDragOver($event: DragEvent) {
        $event.preventDefault();
    }


    handleDrag($event: string) {
        this.dragNodeKey = $event;
    }

    handleDrop($event: DragEvent) {
        if (this.dagContainer) {
            this.dagContainer.createNode($event, this.dragNodeKey);
        }
    }


}
