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
                    "group": "bottom"
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
