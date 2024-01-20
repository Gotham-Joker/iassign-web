import {
    AfterViewInit,
    Component,
    NgZone,
    OnInit,
    Renderer2, TemplateRef,
    ViewChild,
    ViewContainerRef
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
export class DyRow implements OnInit, AfterViewInit, DyComponent {
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
    cols: { ctx: DyRow, comp: any, configComp: any, config: any }[] = []; // 列

    constructor(public ngZone: NgZone,
                public dragDrop: DragDrop,
                public render: Renderer2) {
    }


    ngOnInit(): void {
        // 回显的时候，要异步，不然angular会报错，于是就有了timer(0)
        timer(0).subscribe(() => {
            for (let i = 0; i < this.config.children.length; i++) {
                const config = this.config.children[i];
                const event = this.app.resolveType(config);
                this.onDrop(event, config);
            }
        });
    }

    onDrop(event: CdkDragDrop<string[]> | any, config?: any) {
        const item: DyFormDragItem = event.item.data;
        if (item != null) {
            const configClazz = item.configComponent;
            const componentClazz = item.itemComponent;
            this.cols.push({ctx: this, comp: componentClazz, configComp: configClazz, config});
        } else {
            // if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            /*   } else {
                   transferArrayItem(
                       event.previousContainer.data,
                       event.container.data,
                       event.previousIndex,
                       event.currentIndex);
               }*/
        }

    }

    ngAfterViewInit(): void {
    }


    toJson(children: any[]) {
        const len = this.cols.length;
        for (let i = 0; i < len; i++) {
            const col = this.cols[i];
            children.push(col.config);
        }
    }

    /**
     * 创建组件，并在组件上一级的列中绑定组件span配置项
     * @param that
     * @param idx
     * @param component
     * @param dyCol
     */
    onCreate(that: DyRow, idx: number, component: any, dyCol: { comp: any, configComp: any, config: any }) {
        if (dyCol.config != null) {
            component.instance['config'] = dyCol.config;
        }
        const el = component.location.nativeElement;
        const id = that.app.genId();
        // 绑定函数：显示配置面板
        const mouseDown = that.render.listen(el, 'mousedown', (event) => {
            event.stopPropagation(); // 阻止事件继续传播
            if (id == that.app.formItemId) {
                return;
            }
            that.app.formItemId = id;
            that.app.showConfigPanel(component, dyCol.configComp);
        });

        // 绑定函数：右键菜单
        const contextMenu = that.render.listen(el, 'contextmenu', (ev) => {
            ev.stopPropagation(); // 阻止事件继续传播
            that.app.showContextMenu(ev);
        });
        that.app.formItemsHolder[id] = {
            listeners: [mouseDown, contextMenu],
            instance: component
        };
        that.app.formItemId = id;
        that.app.showConfigPanel(component, dyCol.configComp);
        // 让nz-col重新绑定config，不过这样数据会反向流动到父级元素(nz-col)，angular是不允许这样的
        // 所以，搞个异步timer，即setTimeout来解决此问题。理论上onPush策略性能应该更好，但是现在的情况太复杂了，手动检测不现实。
        timer(0).subscribe(() => {
            that.cols[idx]['config'] = component.instance['config'];
        })
    }

    /**
     * 销毁列
     * @param that
     * @param idx
     */
    onDestroy(that: DyRow, idx: number) {
        that.cols.splice(idx, 1);
    };
}
