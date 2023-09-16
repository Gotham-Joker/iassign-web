import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {IdWorker} from "../../../../core/snowflake-id/id-worker";
import {DagNode} from "../../../interface/dag-node.interface";
import {Cell} from "@antv/x6";

@Component({
    selector: 'dag-gateway-node',
    templateUrl: './gateway-node.html',
    styleUrls: ['./gateway-node.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayNode implements OnInit, DagNode {
    data: any = {}
    cell: any;
    image = {
        success: '/assets/img/status_success.png',
        failed: '/assets/img/status_failed.png',
        running: '/assets/img/status_running.png'
    }
    interacting: boolean = true;


    constructor(private cdr: ChangeDetectorRef) {
    }

    onContextMenu = new EventEmitter();

    ngOnInit() {
    }

    onDagInit(data: any, cell: Cell) {
        this.data = data;
        this.cell = cell;
        this.cdr.detectChanges(); // 手动触发变更检测
    }

    public static createNode() {
        return {
            id: IdWorker.nextId(),
            data: {
                label: '新建网关',
                status: 'default'
            },
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
            shape: 'gateway-node',
            component: GatewayNode,
            width: 60,
            height: 60,
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