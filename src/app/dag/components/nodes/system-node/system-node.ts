import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {IdWorker} from "../../../../core/snowflake-id/id-worker";
import {DagNode} from "../../../interface/dag-node.interface";
import {Cell} from "@antv/x6";

@Component({
    selector: 'app-system-node',
    templateUrl: './system-node.html',
    styleUrls: ['./system-node.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemNode implements OnInit, DagNode {
    // 当前dag节点的数据
    data: any = {
        label: '',
        status: null,
        url: '',
        condition: '',
        retry: 0,
        connectTimeout: 0,
        socketTimeout: 0,
        script: ''
    };
    cell: Cell;
    image = {
        success: '/assets/img/status_success.png',
        failed: '/assets/img/status_failed.png',
        running: '/assets/img/status_running.png'
    }
    interacting: boolean = true;
    onContextMenu: EventEmitter<any> = new EventEmitter<any>();
    // 配置抽屉
    visible: boolean = false

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

    onDagInit(data: any, cell: Cell) {
        this.data = data;
        if (this.data.script == null) {
            this.data.script = '';
        }
        this.cell = cell;
        this.cdr.detectChanges(); // 手动触发变更检测
    }

    // 关闭抽屉
    close() {
        this.visible = false;
        this.cdr.detectChanges();
    }

    // 编辑
    edit() {
        this.visible = true;
        this.cdr.detectChanges();
    }

    save() {
        this.visible = false;
        this.cdr.detectChanges();
    }

    public static createNode() {
        return {
            id: IdWorker.nextId(),
            data: {
                label: '系统处理',
                status: 'default'
            },
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
            shape: 'system-node',
            component: SystemNode,
            width: 180,
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
