import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DagContainer} from "../dag-container/dag-container";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
    selector: 'dag-toolbar',
    templateUrl: './toolbar.html',
    styleUrls: ['./toolbar.scss'],
    standalone: true,
    imports: [NzToolTipModule, NzButtonModule, NzIconModule]
})
export class Toolbar {
    @Input()
    dagContainer: DagContainer;
    @Output()
    onSave: EventEmitter<any> = new EventEmitter<any>();

    handleToolbar(type: any, ev?: any) {
        const graph = this.dagContainer.getGraph();
        switch (type) {
            case 'zoom-in':
                graph.zoom(0.1);
                break;
            case 'zoom-out':
                graph.zoom(-0.1);
                break;
            case 'one-to-one':
                graph.zoomTo(1);
                break;
            /* case 'align-center':
                 // 将画布中元素居中展示
                 graph.centerContent();
                 break;*/
            case 'auto-fit':
                // 将画布中元素缩小或者放大一定级别，让画布正好容纳所有元素，可以通过 maxScale 配置最大缩放级别
                graph.zoomToFit({maxScale: 1});
                break;
        }
    }

    /**
     * 保存
     */
    handleSave() {
        const graph = this.dagContainer.getGraph();
        this.onSave.emit(graph.toJSON());
    }

}
