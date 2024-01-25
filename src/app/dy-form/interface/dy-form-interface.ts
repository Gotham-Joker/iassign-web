import {CdkDrag} from '@angular/cdk/drag-drop';
import {TemplateRef} from "@angular/core";

export declare interface DyFormDragGroup {
    title: string;
    icon: any;
    items: Array<DyFormDragItem>;
}

/**
 * 可配置的组件实现这个接口
 */
export declare interface DyComponent {
    config:any;
    templateRef: TemplateRef<any>
}

export declare interface DyFormDragItem {
    name: string;
    type: string;
    component: any;

    [key: string]: any;
}

export interface ItemContext {
    instance?: any;
    cdkDrag: CdkDrag;
}

export interface FormItemsHolder {
    [key: string]: ItemContext;
}
