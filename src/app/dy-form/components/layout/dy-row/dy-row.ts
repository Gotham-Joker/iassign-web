import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, DragDrop} from '@angular/cdk/drag-drop';
import {Dir} from '@angular/cdk/bidi';
import {timer} from 'rxjs';
import {DyFormDragItem} from "../../../interface/dy-form-interface";

@Component({
  selector: 'dy-row',
  templateUrl: './dy-row.html',
  styles: [':host{display: block;}']
})
export class DyRow implements OnInit, AfterViewInit {
  public app: any;
  public data = null;

  config: any = {
    type: 'row',
    cols: [],
    children: []
  };
  idx: number = 0;

  @ViewChildren('itemContainer', {read: ViewContainerRef})
  itemContainer: QueryList<ViewContainerRef>;
  @ViewChild('dropList', {read: CdkDropList})
  cdkDropList: CdkDropList;

  constructor(private ngZone: NgZone,
              private dragDrop: DragDrop,
              private render: Renderer2) {
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
    if (this.idx >= this.config.cols.length) {
      return;
    }
    const item: DyFormDragItem = event.item.data;
    const viewContainerRef = this.itemContainer.get(this.idx) as any;
    if (item != null) {
      const configClazz = item.configComponent;
      const componentClazz = item.itemComponent;
      // 创建表单项
      const component = viewContainerRef.createComponent(componentClazz);
      if (config) {
        component.instance.config = config;
      }
      const el = component.location.nativeElement;
      // 添加拖拽指令
      const cdkDrag = new CdkDrag(component.location, this.cdkDropList, document, this.ngZone, viewContainerRef,
        {}, new Dir(), this.dragDrop, component.changeDetectorRef);

      const id = this.app.genId();
      // 绑定函数：显示配置面板
      const mouseDown = this.render.listen(el, 'mousedown', (event) => {
        event.stopPropagation(); // 阻止事件继续传播
        if (id == this.app.formItemId) {
          return;
        }
        this.app.formItemId = id;
        this.app.showConfigPanel(component, configClazz);
      });

      // 绑定函数：右键菜单
      const contextMenu = this.render.listen(el, 'contextmenu', (ev) => {
        ev.stopPropagation(); // 阻止事件继续传播
        this.app.showContextMenu(ev);
      });
      this.app.formItemsHolder[id] = {
        listeners: [mouseDown, contextMenu],
        instance: component,
        cdkDrag
      };
      this.app.formItemId = id;
      this.app.showConfigPanel(component, configClazz);
      viewContainerRef.insert(viewContainerRef.get(viewContainerRef.length - 1) as any);
      this.idx++;
    }/* else {
      this.itemContainer.move(this.itemContainer.get(event.previousIndex) as any, event.currentIndex);
    }*/
  }

  ngAfterViewInit(): void {
  }


  toJson(children: any[], getInst: (viewRef: any) => (any | null)) {
    const len = this.itemContainer.length;
    for (let i = 0; i < len; i++) {
      const viewRef = this.itemContainer.get(i) as ViewContainerRef;
      for (let j = 0; j < viewRef.length; j++) {
        const subViewRef = viewRef.get(j);
        const inst = getInst(subViewRef);
        children.push(inst.config);
      }
    }
  }

}
