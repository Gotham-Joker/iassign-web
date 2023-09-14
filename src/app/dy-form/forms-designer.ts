import {Component, EventEmitter, NgZone, OnInit, Output, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, DragDrop} from "@angular/cdk/drag-drop";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {Platform} from "@angular/cdk/platform";
import {ScrollDispatcher, ViewportRuler} from "@angular/cdk/overlay";
import {Dir} from "@angular/cdk/bidi";
import * as _ from "lodash";
import {DyInput} from "./components/basic/dy-input/dy-input";
import {DyInputConfig} from "./components/basic/dy-input/dy-input-config";
import {
    DyConfigComponent,
    DyFormDragGroup,
    DyFormDragItem,
    FormItemsHolder,
    ItemContext
} from "./interface/dy-form-interface";
import {DySelect} from "./components/basic/dy-select/dy-select";
import {DySelectConfig} from "./components/basic/dy-select/dy-select-config";
import {DyDatepickerConfig} from "./components/basic/dy-datepicker/dy-datepicker-config";
import {DyUploadConfig} from "./components/basic/dy-upload/dy-upload-config";
import {DyRadio} from "./components/basic/dy-radio/dy-radio";
import {DyRadioConfig} from "./components/basic/dy-radio/dy-radio-config";
import {DyCheckbox} from "./components/basic/dy-checkbox/dy-checkbox";
import {DyCheckboxConfig} from "./components/basic/dy-checkbox/dy-checkbox-config";
import {DyDatepicker} from "./components/basic/dy-datepicker/dy-datepicker";
import {DyUpload} from "./components/basic/dy-upload/dy-upload";
import {DyRow} from "./components/layout/dy-row/dy-row";
import {DyRowConfig} from "./components/layout/dy-row/dy-row-config";
import {IdWorker} from "../core/snowflake-id/id-worker";
import {DyTextarea} from "./components/basic/dy-textarea/dy-textarea";
import {DyTextareaConfig} from "./components/basic/dy-textarea/dy-textarea-config";
import {DyInputNumber} from "./components/basic/dy-input-number/dy-input-number";
import {DyInputNumberConfig} from "./components/basic/dy-input-number/dy-input-number-config";

export declare interface FormConfig {
    id?: string, // 表单编辑的话应该要填id
    name?: string,
    description?: string,
    config?: any,
    children?: any[],

    [key: string]: any
}

@Component({
    selector: 'dy-forms-designer',
    templateUrl: './forms-designer.html',
    styleUrls: ['./forms-designer.scss']
})
export class FormsDesigner implements OnInit {
    // 左侧可拖动的组
    dragGroups: DyFormDragGroup[] = [
        {
            title: '基本组件',
            icon: 'form',
            items: [
                {name: '输入框', type: 'input', itemComponent: DyInput, configComponent: DyInputConfig},
                {name: '文本框', type: 'textarea', itemComponent: DyTextarea, configComponent: DyTextareaConfig},
                {name: '数字框', type: 'number', itemComponent: DyInputNumber, configComponent: DyInputNumberConfig},
                {name: '单选框', type: 'radio', itemComponent: DyRadio, configComponent: DyRadioConfig},
                {name: '复选框', type: 'checkbox', itemComponent: DyCheckbox, configComponent: DyCheckboxConfig},
                {name: '下拉框', type: 'select', itemComponent: DySelect, configComponent: DySelectConfig},
                {name: '日期', type: 'datepicker', itemComponent: DyDatepicker, configComponent: DyDatepickerConfig},
                {name: '上传', type: 'upload', itemComponent: DyUpload, configComponent: DyUploadConfig},
            ]
        }, {
            title: '布局组件',
            icon: 'layout',
            items: [{name: '栅格布局', type: 'row', itemComponent: DyRow, configComponent: DyRowConfig}]
        }
    ];

    @ViewChild('formContainer', {read: CdkDropList}) formContainer: CdkDropList;
    @ViewChild('formItemContainer', {read: ViewContainerRef}) formItemContainer: ViewContainerRef;
    @ViewChild('configPanelContainer', {read: ViewContainerRef}) configPanelContainer: ViewContainerRef;
    @ViewChild('contextMenu', {read: NzDropdownMenuComponent}) contextMenu: NzDropdownMenuComponent;


    @Output()
    onSave: EventEmitter<any> = new EventEmitter<any>();

    formItemsHolder: FormItemsHolder = {};

    formItemId: any; // 当前右键选中的表单项
    dropListConnectedTo: CdkDropList[] = [];
    // form ngModal
    form: FormConfig = {
        id: '',
        name: '',
        description: '',
        config: { // 全局配置
            layout: 'horizontal'
        },
        children: []
    };

    cfgModal: any = {
        visible: false, // 表单基本配置弹窗
        data: {
            layout: 'horizontal'
        }
    };
    // 保存弹窗是否可见
    visible: boolean = false;

    constructor(private platform: Platform,
                private ngZone: NgZone,
                private vr: ViewportRuler,
                private render: Renderer2,
                private dragDrop: DragDrop,
                private scroll: ScrollDispatcher,
                private contextMenuService: NzContextMenuService) {
    }

    ngOnInit(): void {
    }


    drop(event: CdkDragDrop<string[]> | any, config?: any) {
        const item: DyFormDragItem = event.item.data;
        if (item != null) {
            const configClazz = item?.configComponent;
            const componentClazz = item?.itemComponent;
            // 创建表单组件
            const component = this.formItemContainer.createComponent(componentClazz);

            // 如果是通过配置回显表单，那么需要config参数
            if (config) {
                // @ts-ignore
                component.instance.config = config;
            }

            // const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(componentClazz);
            const el = component.location.nativeElement;
            this.render.addClass(el, "cdk-drag");
            // 给它绑定拖拽指令
            const cdkDrag = new CdkDrag(component.location, this.formContainer, document, this.ngZone, this.formItemContainer,
                {}, new Dir(), this.dragDrop, component.changeDetectorRef);

            // 生成ID，根据这个定位组件
            const id = this.genId();
            // 绑定函数：点击该组件实例的时候，在右边显示配置面板
            const mouseDown = this.render.listen(el, 'mousedown', () => {
                if (id == this.formItemId) {
                    return;
                }
                this.formItemId = id;
                this.showConfigPanel(component, configClazz);
            });
            // 绑定函数：右键菜单，用于删除组件
            const contextMenu = this.render.listen(el, 'contextmenu', (ev) => {
                this.showContextMenu(ev);
            });

            // 如果拖拽进来的组件是栅格布局，那么新的组件也可以拖到它的里面
            if (component.instance instanceof DyRow) {
                const inst: DyRow = component.instance;
                inst.app = this;
                const dropList = new CdkDropList(component.location, this.dragDrop, component.changeDetectorRef, this.scroll);
                // 创建一个主题，并订阅它，当发生drop事件时，通知component实例
                dropList.dropped.subscribe(next => inst.onDrop(next));
                dropList.data = id;
                this.dropListConnectedTo = [dropList, ...this.dropListConnectedTo];
            }

            this.formItemsHolder[id] = {
                listeners: [mouseDown, contextMenu],
                instance: component,
                cdkDrag
            };
            this.formItemId = id;
            this.showConfigPanel(component, configClazz);
            this.formItemContainer.insert(this.formItemContainer.get(this.formItemContainer.length - 1) as any, event.currentIndex);
        } else {
            this.formItemContainer.move(this.formItemContainer.get(event.previousIndex) as any, event.currentIndex);
        }

    }

    ngAfterViewInit(): void {
        this.dropListConnectedTo.push(this.formContainer);
    }

    openModal() {
        this.cfgModal.visible = true;
    }

    handleOk(): void {
        this.form.config.layout = this.cfgModal.data.layout;
        this.cfgModal.visible = false;
    }

    handleCancel(): void {
        this.cfgModal.visible = false;
    }


    // 切换表单项的配置
    showConfigPanel(component: any, configClazz: any) {
        this.configPanelContainer.clear();
        const configComponent = this.configPanelContainer.createComponent(configClazz);
        (configComponent.instance as DyConfigComponent<any>).ref = component.instance;
    }

    // 显示右键菜单
    showContextMenu(ev: any) {
        this.contextMenuService.create(ev, this.contextMenu);
    }

    // 删除表单项
    removeFormItem(id: any) {
        const itemContext: ItemContext = this.formItemsHolder[id];
        // 移除监听器
        // itemContext.listeners.forEach(l => removeListener(l));
        // 删除配置面板
        this.configPanelContainer.clear();
        // 删除cdkDrag
        this.formContainer.removeItem(itemContext.cdkDrag);

        // 更新cdkDropListConnectedTo
        if (itemContext.instance.instance instanceof DyRow) {
            for (let i = 0; i < this.dropListConnectedTo.length; i++) {
                const cdkDropList = this.dropListConnectedTo[i];
                if (cdkDropList.data == id) {
                    this.dropListConnectedTo.splice(i, 1);
                    break;
                }
            }

        }
        // 删除表单项
        itemContext.instance.destroy();
        delete this.formItemsHolder[id];
        this.formItemId = null;
    }

    // 生成ID
    genId() {
        return IdWorker.nextId();
    }

    getConfig() {
        const formObj: any = {
            id: this.form.id,
            name: this.form.name,
            description: this.form.description,
            config: _.cloneDeep(this.form.config),
            children: []
        };
        const len = this.formItemContainer.length;
        for (let i = 0; i < len; i++) {
            const viewRef = this.formItemContainer.get(i) as any;
            const inst = this.getInst(viewRef);
            formObj.children.push(inst.config);
            if (inst instanceof DyRow) {
                inst.config.children = [];
                inst.toJson(inst.config.children, this.getInst);
            }
        }
        return formObj;
    }

    private getInst(viewRef: any) {
        if (viewRef && viewRef._view != null && viewRef._view.length > 0) {
            const size = viewRef._view.length;
            const inst = viewRef._view[size - 1];
            return inst;
        }
        return null;
    }


    /**
     * 从json数据回显表单，一般用于编辑已存在的表单
     * @param formConfig
     */
    public parseFromJson(formConfig: FormConfig) {
        this.dropListConnectedTo = [this.formContainer];
        this.formItemContainer.clear();
        this.form = formConfig;
        const children = this.form.children;
        for (let i = 0; i < children.length; i++) {
            const config = children[i];
            const event = this.resolveType(config);
            this.drop(event, children[i]);
        }
    }

    public resolveType(config: any) {
        let event: any = {
            item: {
                data: {}
            }
        };
        for (let i = 0; i < this.dragGroups.length; i++) {
            const items = this.dragGroups[i].items;
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                if (item.type == config.type) {
                    event.item.data.itemComponent = item.itemComponent;
                    event.item.data.configComponent = item.configComponent;
                    return event;
                }
            }
        }
    }


    save() {
        // 获取表单配置信息
        const formObj = this.getConfig();
        this.onSave.emit(formObj);
    }

    closeModal() {
        this.visible = false;
    }
}
