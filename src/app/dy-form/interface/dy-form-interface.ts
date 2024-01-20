import {CdkDrag} from '@angular/cdk/drag-drop';
import {TemplateRef} from "@angular/core";

export declare interface DyFormDragGroup {
    title: string;
    icon: any;
    items: Array<DyFormDragItem>;
}

/**
 * 配置类实现这个接口
 */
export declare interface DyComponent {
    templateRef: TemplateRef<any>
}

export declare interface DyFormDragItem {
    name: string;
    type: string;
    component: any;

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
