import {ChangeDetectorRef, Component, EventEmitter} from '@angular/core';
import {Cell} from "@antv/x6";
import {IdWorker} from "../../../../core/snowflake-id/id-worker";
import {DagNode} from "../../../interface/dag-node.interface";

@Component({
    selector: 'dag-end-node',
    templateUrl: './end-node.html',
    styleUrls: ['./end-node.scss']
})
export class EndNode implements DagNode {
    data: any = {}
    cell: Cell;
    interacting: boolean = true;
    onContextMenu: EventEmitter<any> = new EventEmitter<any>();

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
                    "group": "right"
                }, {
                    "id": IdWorker.nextId(),
                    "group": "bottom"
                },
                {
                    "id": IdWorker.nextId(),
                    "group": "left"
                }
            ]
        }
    }

    /**
     * 节点信息
     */
    public static nodeOptions() {
        return {
            shape: 'end-node',
            component: EndNode,
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
                                stroke: '#C2C8D5',
                                strokeWidth: 1,
                                fill: '#fff',
                            }
                        }
                    },
                    left: {
                        position: 'left',
                        attrs: {
                            circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#C2C8D5',
                                strokeWidth: 1,
                                fill: '#fff',
                            }
                        }
                    },
                    right: {
                        position: 'right',
                        attrs: {
                            circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#C2C8D5',
                                strokeWidth: 1,
                                fill: '#fff',
                            }
                        }
                    },
                    bottom: {
                        position: 'bottom',
                        attrs: {
                            circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#C2C8D5',
                                strokeWidth: 1,
                                fill: '#fff',
                            }
                        }
                    }
                }
            }
        }
    }
}
