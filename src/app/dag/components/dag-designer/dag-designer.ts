import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DagContainer} from "../dag-container/dag-container";
import { NodePanel } from '../node-panel/node-panel';
import { NgStyle } from '@angular/common';
import { Toolbar } from '../toolbar/toolbar';

@Component({
    selector: 'dag-designer',
    templateUrl: './dag-designer.html',
    standalone: true,
    imports: [Toolbar, NgStyle, DagContainer, NodePanel]
})
export class DagDesigner implements OnInit {
    @ViewChild('dagContainer', {read: DagContainer, static: true})
    dagContainer: DagContainer;
    @ViewChild('ele', {read: ElementRef, static: true})
    ele: ElementRef;

    dragNodeKey: string;
    @Output()
    onSave: EventEmitter<any> = new EventEmitter<any>();
    // 从拖拽面板拖拽组件出来时，记下来组件的类型
    containerHeight: any = '0px';

    constructor() {
    }

    ngOnInit(): void {
        // 既然是static的，那就不用等到timer再去获取高度了
        this.containerHeight = this.ele.nativeElement.clientHeight - 33 + 'px'
    }


    // 判断是否允许放置，一律允许

    handleDragOver($event: DragEvent) {
        $event.preventDefault();
    }


    handleDrag($event: string) {
        this.dragNodeKey = $event;
    }

    handleDrop($event: DragEvent) {
        if (this.dagContainer) {
            this.dagContainer.createNode($event, this.dragNodeKey);
        }
    }


}
