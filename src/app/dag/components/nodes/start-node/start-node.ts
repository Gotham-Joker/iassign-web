import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter} from '@angular/core';
import {Cell} from "@antv/x6";
import {IdWorker} from "../../../../core/snowflake-id/id-worker";
import {DagNode} from "../../../interface/dag-node.interface";

@Component({
    selector: 'dag-start-node',
    templateUrl: './start-node.html',
    styleUrls: ['./start-node.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
