import {
    AfterViewInit,
    Component,
    NgZone,
    OnInit,
    Renderer2, TemplateRef,
    ViewChild
} from '@angular/core';
import {CdkDragDrop, CdkDropList, DragDrop, moveItemInArray, CdkDrag} from '@angular/cdk/drag-drop';
import {timer} from 'rxjs';
import {DyComponent, DyFormDragItem} from "../../../interface/dy-form-interface";
import {NzRowDirective, NzGridModule} from "ng-zorro-antd/grid";
import {DyColDirective} from '../../../dy-col.directive';
import {NgFor} from '@angular/common';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzTabComponent, NzTabSetComponent} from "ng-zorro-antd/tabs";
import {FormsModule} from "@angular/forms";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";

@Component({
    selector: 'dy-row',
    templateUrl: './dy-row.html',
    styles: [':host{display: block;}.indicator-bd{border: solid 1px #1890ff;cursor: move}'],
    standalone: true,
    imports: [NzGridModule, CdkDropList, NzFormModule, NgFor, CdkDrag, DyColDirective, NzDividerComponent, NzTabComponent, FormsModule, NzInputDirective, NzRadioGroupComponent, NzRadioComponent, NzIconDirective, NzPopoverDirective, NzInputNumberComponent, NzTabSetComponent]
})
export class DyRow implements OnInit, DyComponent {
    @ViewChild('cfgTpl', {static: true, read: TemplateRef})
    templateRef;

    public app: any;
    public data = null;

    config: any = {
        type: 'row',
        layout: 'horizontal',
        children: []
    };

    @ViewChild('dropList', {read: CdkDropList})
    cdkDropList: CdkDropList;
    @ViewChild('nzRow', {read: NzRowDirective})
    nzRow: NzRowDirective;
    cols: { ctx: DyRow, comp: any, config: any }[] = []; // 列

    constructor() {
    }


    ngOnInit(): void {
        for (let i = 0; i < this.config.children.length; i++) {
            const config = this.config.children[i];
            const event = this.app.resolveType(config);
            this.onDrop(event, config);
        }
    }

    onDrop(event: CdkDragDrop<string[]> | any, config?: any) {
        const item: DyFormDragItem = event.item.data;
        if (item != null) {
            const Class = item.component;
            if (config == null) {
                config = Object.assign({}, new Class().config)
            }
            this.cols.push({ctx: this, comp: Class, config});
        } else {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }

    }

    toJson(children: any[]) {
        const len = this.cols.length;
        for (let i = 0; i < len; i++) {
            const col = this.cols[i];
            children.push(col.config);
        }
    }

}
