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

import {
    Directive,
    Input,
    OnChanges,
    OnDestroy, Renderer2,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core';
import {DyRow} from "../dy-row/dy-row";

@Directive({
    selector: '[dyCol]',
    standalone: true
})
export class DyColDirective implements OnChanges, OnDestroy {
    public componentRef;
    @Input()
    dyCol: { ctx: DyRow, comp: any, config: any };
    @Input()
    dyColIndex: number;
    @Input()
    dyColParent: HTMLElement;

    constructor(protected viewContainerRef: ViewContainerRef, private render: Renderer2) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dyCol'] !== undefined) {
            this.viewContainerRef.clear();
            this.componentRef = null;
            if (this.dyCol['comp']) {
                this.componentRef = this.viewContainerRef.createComponent(this.dyCol['comp']);
                const dyRow=this.dyCol.ctx;
                this.componentRef.onDestroy(() => dyRow.cols.splice(this.dyColIndex, 1));
                this.create(dyRow, this.componentRef, this.dyCol.config);
            }
        }
    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy()
        }
    }

    /**
     * 创建组件，并在组件上一级的列中绑定组件span配置项
     * @param dyRow
     * @param idx
     * @param component
     * @param config
     */
    create(dyRow: DyRow, component: any, config) {
        if (config != null) {
            component.instance['config'] = config;
        }
        const el = this.dyColParent;
        const id = dyRow.app.genId();
        // 绑定函数：显示配置面板
        const mouseDown = this.render.listen(el, 'mousedown', (event) => {
            event.stopPropagation(); // 阻止事件继续传播
            if (id == dyRow.app.formItemId) {
                return;
            }
            dyRow.app.formItemId = id;
            dyRow.app.showConfigPanel(component);
        });

        // 绑定函数：右键菜单
        const contextMenu = this.render.listen(el, 'contextmenu', (ev) => {
            ev.stopPropagation(); // 阻止事件继续传播
            dyRow.app.formItemId = id;
            dyRow.app.showContextMenu(ev);
        });
        dyRow.app.formItemsHolder[id] = {
            listeners: [mouseDown, contextMenu],
            instance: component
        };
        dyRow.app.formItemId = id;
        dyRow.app.showConfigPanel(component);
    }

}