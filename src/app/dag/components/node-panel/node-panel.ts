import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'dag-node-panel',
    templateUrl: './node-panel.html',
    styleUrls: ['./node-panel.scss']
})
export class NodePanel {
    @Output()
    nodeDrag: EventEmitter<any> = new EventEmitter<any>();
    nodes: any[] = [
        {key: 'start-node', icon: 'svg:start', label: '开始'},
        {key: 'user-task-node', icon: 'svg:user_task', label: '审批'},
        {key: 'gateway-node', icon: 'svg:gateway', label: '网关'},
        {key: 'system-node', icon: 'svg:system', label: '系统'},
        {key: 'end-node', icon: 'svg:end', label: '结束'}
    ]


    handleDragStart($event: DragEvent, key: string) {
        this.nodeDrag.emit(key);
    }
}
