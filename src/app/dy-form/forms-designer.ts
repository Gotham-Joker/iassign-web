import {
    AfterViewInit,
    Component,
    EventEmitter,
    NgZone,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, DragDrop} from "@angular/cdk/drag-drop";
import {NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule} from "ng-zorro-antd/dropdown";
import {Platform} from "@angular/cdk/platform";
import {ScrollDispatcher, ViewportRuler} from "@angular/cdk/overlay";
import {Dir} from "@angular/cdk/bidi";
import * as _ from "lodash";
import {DyInput} from "./components/basic/dy-input/dy-input";
import {
    DyFormDragGroup,
    DyFormDragItem,
    FormItemsHolder,
    ItemContext
} from "./interface/dy-form-interface";
import {DySelect} from "./components/basic/dy-select/dy-select";
import {DyRadio} from "./components/basic/dy-radio/dy-radio";
import {DyCheckbox} from "./components/basic/dy-checkbox/dy-checkbox";
import {DyDatepicker} from "./components/basic/dy-datepicker/dy-datepicker";
import {DyUpload} from "./components/basic/dy-upload/dy-upload";
import {DyRow} from "./components/layout/dy-row/dy-row";
import {IdWorker} from "../core/snowflake-id/id-worker";
import {DyTextarea} from "./components/basic/dy-textarea/dy-textarea";
import {DyInputNumber} from "./components/basic/dy-input-number/dy-input-number";
import {NzInputModule} from 'ng-zorro-antd/input';
import {FormsModule} from '@angular/forms';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NgFor, NgIf} from '@angular/common';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMessageModule} from "ng-zorro-antd/message";
import {DyRichtext} from "./components/basic/dy-richtext/dy-richtext";
import {DyCascader} from "./components/basic/dy-cascader/dy-cascader";

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
    styleUrls: ['./forms-designer.scss'],
    standalone: true,
    imports: [NzLayoutModule, NzMenuModule, NgFor, NzButtonModule, NgIf, CdkDropList, CdkDrag, NzPopoverModule,
        NzIconModule, NzFormModule, NzModalModule, NzGridModule, NzRadioModule, FormsModule, NzInputModule,
        NzDropDownModule, NzMessageModule]
})
export class FormsDesigner implements OnInit, AfterViewInit {
    // 左侧可拖动的组
    dragGroups: DyFormDragGroup[] = [
        {
            title: '基本组件',
            icon: 'form',
            items: [
                {name: '输入框', type: 'input', component: DyInput},
                {name: '数字', type: 'number', component: DyInputNumber},
                {name: '文本域', type: 'textarea', component: DyTextarea},
                {name: '日期', type: 'datepicker', component: DyDatepicker},
                {name: '单选', type: 'radio', component: DyRadio},
                {name: '多选', type: 'checkbox', component: DyCheckbox},
                {name: '下拉', type: 'select', component: DySelect},
                {name: '级联', type: 'cascader', component: DyCascader},
                {name: '上传', type: 'upload', component: DyUpload},
                {name: '富文本', type: 'richtext', component: DyRichtext}
            ]
        }, {
            title: '布局组件',
            icon: 'layout',
            items: [{name: '栅格布局', type: 'row', component: DyRow}]
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

    constructor(private ngZone: NgZone,
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
            const componentClazz = item?.component;
            // 创建表单组件
            const component = this.formItemContainer.createComponent(componentClazz);

            // 如果是通过配置回显表单，那么需要config参数
            if (config) {
                // @ts-ignore
                component.instance.config = config;
            }

            // const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(componentClazz);
            const el = component.location.nativeElement;
            this.render.addClass(el, "cdk-drag")
            // 给它绑定拖拽指令
            const cdkDrag = new CdkDrag(component.location, this.formContainer, document, this.ngZone, this.formItemContainer,
                {}, new Dir(), this.dragDrop, component.changeDetectorRef);

            // 生成ID，根据这个定位组件
            const id = this.genId();
            // 绑定函数：点击该组件实例的时候，在右边显示配置面板
            this.render.listen(el, 'mousedown', () => {
                if (id == this.formItemId) {
                    return;
                }
                this.formItemId = id;
                this.showConfigPanel(component);
            });
            // 绑定函数：右键菜单，用于删除组件
            this.render.listen(el, 'contextmenu', (ev) => {
                this.formItemId = id;
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
                // 菜单上的组件也可以挪动到栅格布局里
                this.dropListConnectedTo = [dropList, ...this.dropListConnectedTo];
            }

            this.formItemsHolder[id] = {
                instance: component,
                cdkDrag
            };
            this.formItemId = id;
            this.showConfigPanel(component);
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
    showConfigPanel(component: any) {
        this.configPanelContainer.clear();
        const inst = component.instance;
        this.configPanelContainer.createEmbeddedView(inst.templateRef);
    }

    // 显示右键菜单
    showContextMenu(ev: any) {
        this.contextMenuService.create(ev, this.contextMenu);
    }

    // 删除表单项
    removeFormItem(id: any) {
        const itemContext: ItemContext = this.formItemsHolder[id];
        // 删除配置面板
        this.configPanelContainer.clear();
        if (itemContext.cdkDrag) {
            // 删除cdkDrag
            this.formContainer.removeItem(itemContext.cdkDrag);
        }

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
                inst.toJson(inst.config.children);
            }
        }
        return formObj;
    }

    private getInst(viewRef: any) {
        if (viewRef && viewRef._lView != null && viewRef._lView.length > 0) {
            const size = viewRef._lView.length;
            return viewRef._lView[size - 1];
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
                    event.item.data.component = item.component;
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
