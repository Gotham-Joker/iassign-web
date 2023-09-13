import {CdkDrag} from '@angular/cdk/drag-drop';

export declare interface DyFormDragGroup {
  title: string;
  icon: any;
  items: Array<DyFormDragItem>;
}

/**
 * 配置类实现这个接口
 */
export declare interface DyConfigComponent<T> {
  ref: T
}

export declare interface DyFormDragItem {
  name: string;
  type: string;
  itemComponent: any;
  configComponent: any;

  [key: string]: any;
}

export interface ItemContext {
  listeners?: any[];
  instance?: any;
  cdkDrag: CdkDrag<any>;
}

export interface FormItemsHolder {
  [key: string]: ItemContext;
}
