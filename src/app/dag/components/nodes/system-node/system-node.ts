import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {IdWorker} from "../../../../core/snowflake-id/id-worker";
import {DagNode} from "../../../interface/dag-node.interface";
import {Cell} from "@antv/x6";
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NgClass, NgIf} from '@angular/common';
import {NzSelectModule} from "ng-zorro-antd/select";

@Component({
    selector: 'app-system-node',
    templateUrl: './system-node.html',
    styleUrls: ['./system-node.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NzButtonModule, NzIconModule, NgIf, NzDrawerModule, NzTabsModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzInputNumberModule, NzWaveModule, NzSelectModule]
})
export class SystemNode implements OnInit, DagNode {
    // 当前dag节点的数据
    data: any = {
        label: '',
        status: null,
        url: '',
        condition: '',
        retry: 0,
        method: 'POST',
        header: '',
        body: '',
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
