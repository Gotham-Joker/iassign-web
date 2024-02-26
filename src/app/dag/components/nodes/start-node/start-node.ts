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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter} from '@angular/core';
import {Cell} from "@antv/x6";
import {IdWorker} from "../../../../core/snowflake-id/id-worker";
import {DagNode} from "../../../interface/dag-node.interface";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
    selector: 'dag-start-node',
    templateUrl: './start-node.html',
    styleUrls: ['./start-node.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NzButtonModule, NzIconModule]
})
export class StartNode implements DagNode {
    data: any = {}
    cell: Cell;
    onContextMenu: EventEmitter<any> = new EventEmitter<any>();
    interacting: boolean = true;

    constructor(private cdr: ChangeDetectorRef) {
    }

    onDagInit(data: any, cell: Cell) {
        this.data = data;
        this.cell = cell;
        this.cdr.detectChanges(); // 手动触发变更检测
    }

    public static createNode() {
        return {
            id: IdWorker.nextId(),
            ports: [
                {
                    "id": IdWorker.nextId(),
                    "group": "top"
                },
                {
                    "id": IdWorker.nextId(),
                    "group": "bottom"
                },
                {
                    "id": IdWorker.nextId(),
                    "group": "left"
                },
                {
                    "id": IdWorker.nextId(),
                    "group": "right"
                }
            ]
        }
    }

    /**
     * 节点信息
     */
    public static nodeOptions() {
        return {
            shape: 'start-node',
            component: StartNode,
            width: 40,
            height: 40,
            ports: { // 连接端点
                groups: {
                    top: {
                        position: 'top',
                        attrs: {
                            circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#C2C8D500',
                                strokeWidth: 1,
                                fill: '#ffffff00',
                            }
                        }
                    },
                    left: {
                        position: 'left',
                        attrs: {
                            circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#C2C8D500',
                                strokeWidth: 1,
                                fill: '#ffffff00',
                            }
                        }
                    },
                    right: {
                        position: 'right',
                        attrs: {
                            circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#C2C8D500',
                                strokeWidth: 1,
                                fill: '#ffffff00',
                            }
                        }
                    },
                    bottom: {
                        position: 'bottom',
                        attrs: {
                            circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#C2C8D500',
                                strokeWidth: 1,
                                fill: '#ffffff00',
                            }
                        }
                    }
                }
            }
        }
    }
}
