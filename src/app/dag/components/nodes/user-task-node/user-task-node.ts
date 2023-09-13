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


@Component({
  selector: 'dag-user-task-node',
  templateUrl: './user-task-node.html',
  styleUrls: ['./user-task-node.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTaskNode implements OnInit, DagNode {
  // 当前dag节点的数据
  data: any = {
    label: '',
    status: null,
    formId: '',
    userList: [],
    roleList: [],
    userScript: '',
    roleScript: ''
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
  visible: boolean = false;
  userOptions: any[] = [];
  roleOptions: any[] = [];

  constructor(private cdr: ChangeDetectorRef, @Optional() @Inject(DAG_DATA_SVC) private dagDataSvc: DagDataServiceInterface) {
  }

  ngOnInit() {
  }

  onDagInit(data: any, cell: Cell) {
    this.data = data;
    if (!this.data['userList']) {
      this.data.userList = [];
    }
    if (!this.data['roleList']) {
      this.data.roleList = [];
    }
    if (!this.data['userScript']) {
      this.data.userScript = '';
    }
    if (!this.data['roleScript']) {
      this.data.roleScript = '';
    }
    this.cell = cell;
    this.cdr.detectChanges(); // 手动触发变更检测
  }

  save() { // 保存
    this.visible = false;
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


  public static createNode() {
    return {
      id: IdWorker.nextId(),
      data: {
        label: '新建审批',
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

}
