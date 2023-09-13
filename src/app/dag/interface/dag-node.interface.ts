import {Cell} from "@antv/x6";
import {EventEmitter} from "@angular/core";

export interface DagNode {
    onDagInit(data: any, cell: Cell);

    /**
     * 右键菜单
     */
    onContextMenu?: EventEmitter<{ ev: Event, cell: Cell }>;
    /**
     * 是否可编辑
     */
    interacting: boolean;
}