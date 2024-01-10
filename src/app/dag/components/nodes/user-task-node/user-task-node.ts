import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    OnInit,
    Optional
} from '@angular/core';
import {Cell} from "@antv/x6";
import {zip} from "rxjs";
import {IdWorker} from "../../../../core/snowflake-id/id-worker";
import {DagNode} from "../../../interface/dag-node.interface";
import {DAG_DATA_SVC, DagDataServiceInterface} from "../../../dag-data-service.interface";
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NgClass, NgIf} from '@angular/common';
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzRadioModule} from "ng-zorro-antd/radio";


@Component({
    selector: 'dag-user-task-node',
    templateUrl: './user-task-node.html',
    styleUrls: ['./user-task-node.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NzButtonModule, NzIconModule, NgIf, NzDrawerModule, NzTabsModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzSelectModule, NzWaveModule, NzCheckboxModule, NzRadioModule]
})
export class UserTaskNode implements OnInit, DagNode {
    // 当前dag节点的数据
    data: any = {};

    cell: Cell;
    image = {
        success: '/assets/img/status_success.png',
        failed: '/assets/img/status_failed.png',
        running: '/assets/img/status_running.png'
    }
    interacting: boolean = true;

    onContextMenu: EventEmitter<any> = new EventEmitter<any>();
    // 配置抽屉
    visible: boolean = false;
    userOptions: any[] = [];
    roleOptions: any[] = [];

    constructor(private cdr: ChangeDetectorRef, @Optional() @Inject(DAG_DATA_SVC) private dagDataSvc: DagDataServiceInterface) {
    }

    ngOnInit() {
    }

    onDagInit(data: any, cell: Cell) {
        this.data = data;
        this.cell = cell;
        this.cdr.detectChanges(); // 手动触发变更检测
    }

    save() { // 保存
        this.visible = false;
        this.cdr.detectChanges();
    }

    // 关闭抽屉
    close() {
        this.visible = false;
        this.cdr.markForCheck();
    }

    // 编辑
    edit() {
        this.visible = true;
        if (this.dagDataSvc) {
            zip(this.dagDataSvc.loadUsers(), this.dagDataSvc.loadRoles())
                .subscribe(([userOptions, roleOptions]) => {
                    this.userOptions = userOptions;
                    this.roleOptions = roleOptions;
                    this.cdr.detectChanges();
                });
        }
        this.cdr.detectChanges();
    }


    /**
     * 拖拽节点进来时，初始化一些节点数据，以及连接点
     */
    public static createNode() {
        return {
            id: IdWorker.nextId(),
            data: {  // 节点初始数据
                label: '新建审批',
                status: 'default',
                userList: [],
                roleList: [],
                userScript: '',
                roleScript: '',
                countersign: false, // 是否是会签节点
                fileRequired: false, // 是否必传附件
                assign: false // 是否允许指派
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
            shape: 'user-task-node',
            component: UserTaskNode,
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

    /**
     * 手动触发变更检测，更新UI
     */
    detectChanges() {
        this.cdr.detectChanges();
    }
}
