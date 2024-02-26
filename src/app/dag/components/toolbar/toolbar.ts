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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DagContainer} from "../dag-container/dag-container";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
    selector: 'dag-toolbar',
    templateUrl: './toolbar.html',
    styleUrls: ['./toolbar.scss'],
    standalone: true,
    imports: [NzToolTipModule, NzButtonModule, NzIconModule]
})
export class Toolbar {
    @Input()
    dagContainer: DagContainer;
    @Output()
    onSave: EventEmitter<any> = new EventEmitter<any>();

    handleToolbar(type: any, ev?: any) {
        const graph = this.dagContainer.getGraph();
        switch (type) {
            case 'zoom-in':
                graph.zoom(0.1);
                break;
            case 'zoom-out':
                graph.zoom(-0.1);
                break;
            case 'one-to-one':
                graph.zoomTo(1);
                break;
            /* case 'align-center':
                 // 将画布中元素居中展示
                 graph.centerContent();
                 break;*/
            case 'auto-fit':
                // 将画布中元素缩小或者放大一定级别，让画布正好容纳所有元素，可以通过 maxScale 配置最大缩放级别
                graph.zoomToFit({maxScale: 1});
                break;
        }
    }

    /**
     * 保存
     */
    handleSave() {
        const graph = this.dagContainer.getGraph();
        this.onSave.emit(graph.toJSON());
    }

}
