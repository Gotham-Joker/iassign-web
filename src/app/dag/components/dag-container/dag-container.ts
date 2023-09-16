import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef, HostListener, Input,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Cell, Edge, Graph, Shape} from "@antv/x6";
import {UserTaskNode} from "../nodes/user-task-node/user-task-node";
import {concatMap, of, Subject, switchMap, takeUntil, timer, from, Observable} from "rxjs";
import {Dnd} from "@antv/x6-plugin-dnd";
import {GatewayNode} from "../nodes/gateway-node/gateway-node";
import {SystemNode} from "../nodes/system-node/system-node";
import {StartNode} from "../nodes/start-node/start-node";
import {EndNode} from "../nodes/end-node/end-node";
import {NodeDataInterface} from "../../interface/node-data.interface";

@Component({
    selector: 'dag-container',
    templateUrl: './dag-container.html',
    styleUrls: ['./dag-container.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush // 通过手动调用detectChanges()来刷新UI，能极大的提升页面性能
})
export class DagContainer implements OnInit, OnDestroy {
    @ViewChild('container', {static: true, read: ElementRef})
    container: ElementRef;
    @ViewChild('contextMenu', {static: true, read: ElementRef})
    contextMenu: ElementRef;
    isEdge: boolean = false;
    @Input()
    interacting: boolean = true;

    @HostListener('window:click', ['$event'])
    onClick(ev: Event) {
        if (!this.contextMenuHide) {
            // ev.preventDefault();
            this.contextMenuHide = true;
            this.cdr.detectChanges();
        }
    }

    private graph: Graph;
    private dnd: Dnd;
    private $destroy: Subject<boolean> = new Subject<boolean>();
    private componentMap: any = {}
    cell: Cell;
    visible: boolean = false;
    edgeLabel: any;
    edgeCondition: any;
    contextMenuHide: boolean = true;

    constructor(private zone: NgZone,
                private cdr: ChangeDetectorRef,
                private vcf: ViewContainerRef) {
    }

    ngOnInit(): void {
        // 注册用户审批节点、网关节点和系统节点
        this.registerNode(StartNode.nodeOptions())
        this.registerNode(UserTaskNode.nodeOptions())
        this.registerNode(GatewayNode.nodeOptions())
        this.registerNode(SystemNode.nodeOptions())
        this.registerNode(EndNode.nodeOptions())

        // 初始化流程图
        this.initGraph();
    }

    /**
     * 注册angular组件作为节点
     * @param options
     * @private
     */
    private registerNode(options: any) {
        Shape.HTML.register({
            ...options,
            effect: ['data'],
            html: (cell) => {
                const component = this.vcf.createComponent(options.component);
                const instance = component.instance as any;
                instance.interacting = this.interacting;
                if (instance.onDagInit) {
                    instance.onDagInit(cell.data, cell);
                }
                if (instance.onContextMenu) {
                    instance.onContextMenu.subscribe(({ev, cell}) => {
                        this.cell = cell;
                        this.contextMenu.nativeElement.style.left = ev.clientX + 'px';
                        this.contextMenu.nativeElement.style.top = ev.clientY + 'px';
                        this.isEdge = false;
                        this.contextMenuHide = false;
                        this.cdr.detectChanges();
                    })
                }
                return component.location.nativeElement;
            }
        });
        this.componentMap[options.shape] = options.component;
    }


    private initGraph() {

        // 注册"边"
        Graph.registerEdge(
            'dag-edge',
            {
                inherit: 'edge',
                attrs: {
                    line: {
                        stroke: '#989898',
                        strokeWidth: 1,
                        // 不显示箭头就设置为null
                        // targetMarker: 'classic',
                    },
                }
            },
            true,
        )


        this.zone.runOutsideAngular(() => {
            const ele = this.container.nativeElement;
            this.graph = new Graph({
                // false关闭交互模式 （只能预览）
                interacting: this.interacting,
                container: ele,
                autoResize: true,
                panning: {
                    enabled: true,
                    eventTypes: ['leftMouseDown'],
                },
                mousewheel: {
                    enabled: true,
                    modifiers: 'ctrl',
                    factor: 1.1,
                    maxScale: 1.5,
                    minScale: 0.5,
                },
                highlighting: {
                    // 连接桩可以被连接时在连接桩外围围渲染一个包围框
                    magnetAvailable: {
                        name: 'stroke',
                        args: {
                            attrs: {
                                fill: '#fff',
                                stroke: '#A4DEB1',
                                strokeWidth: 4,
                            },
                        },
                    },
                    // 连接桩吸附连线时在连接桩外围围渲染一个包围框
                    magnetAdsorbed: {
                        name: 'stroke',
                        args: {
                            attrs: {
                                fill: '#fff',
                                stroke: '#31d0c6',
                                strokeWidth: 4,
                            },
                        },
                    },
                },
                connecting: {
                    snap: true,
                    allowBlank: false,
                    allowLoop: false,
                    allowEdge: false,
                    allowMulti: false,
                    allowNode: false, // 不能把线直接连接到节点
                    allowPort: true,
                    highlight: true,
                    // connector: 'algo-connector',
                    connector: "smooth", // 三次贝塞尔曲线
                    connectionPoint: 'anchor',
                    anchor: 'center',
                    validateMagnet({cell, magnet}) {
                        if (cell.shape == 'end-node') {
                            return false; // 结束节点不存在出口
                        }
                        if (cell.shape != 'gateway-node') { // 只有网关可以存在多个出口，其他节点只有一个出口
                            const outgoingEdges = this.getOutgoingEdges(cell);
                            if (outgoingEdges != null && outgoingEdges.length == 1) {
                                return false;
                            }
                        }
                        return true;
                    },
                    validateConnection({targetCell, targetMagnet}) {
                        return targetCell.shape !== 'start-node'; //开始节点不存在入口连接线

                    },
                    createEdge() {
                        return graph.createEdge({
                            shape: 'dag-edge',
                            attrs: {
                                line: {
                                    strokeDasharray: '5 5',
                                },
                            },
                            zIndex: -1,
                            //  添加小工具，能调节连线
                            // tools: ["vertices"]
                        })
                    }
                },
                background: {color: '#d3d4d0'},
            })
            const graph = this.graph;
            this.dnd = new Dnd({
                target: graph,
                getDragNode: (node) => node.clone({keepId: true}),
                getDropNode: (node) => node.clone({keepId: true})
            })
            graph.on('edge:connected', ({edge}) => {
                edge.attr({
                    line: {
                        strokeDasharray: '',
                    },
                })
            });

            // 交互模式才开启
            if (this.interacting) {

                // 线条的右键菜单
                graph.on('edge:contextmenu', ({e, edge}) => {
                    const event = e.originalEvent as any;
                    this.cell = edge;
                    this.contextMenu.nativeElement.style.left = event.clientX + 'px';
                    this.contextMenu.nativeElement.style.top = event.clientY + 'px';
                    this.isEdge = true;
                    this.contextMenuHide = false;
                    this.cdr.detectChanges();
                });

                graph.on("edge:mouseleave", ({cell}) => {
                    if (cell.hasTool("vertices")) {
                        cell.removeTool("vertices");
                    }
                });

                // 双击线条，展开配置抽屉
                graph.on('edge:dblclick', ({edge}) => {
                    const labels = edge.getLabels();
                    if (labels != null && labels.length > 0) {
                        this.edgeLabel = labels[0].attrs['label']['text'];
                    } else {
                        this.edgeLabel = ''
                    }
                    if (edge.getData() == null) {
                        edge.setData({'condition': ''});
                    }
                    this.edgeCondition = edge.getData()['condition'];
                    this.cell = edge;
                    this.visible = true;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    ngOnDestroy(): void {
        if (this.graph) {
            this.graph.dispose();
        }
        this.$destroy.next(true)
    }

    getGraph() {
        return this.graph;
    }

    createNode($event: any, nodeType) {
        const component = this.componentMap[nodeType] as any;
        const node = this.graph.createNode({
            shape: nodeType,
            ...component.createNode()
        });
        this.dnd.start(node, $event)
    }

    /**
     * 显示节点状态
     */
    showNodeStatus(statusList: NodeDataInterface[]) {
        // 先取出第一个立即显示状态，其他的再分别展示
        from(statusList).pipe(
            concatMap((nodeData) => this.changeNodeStatus(nodeData))
        ).subscribe(() => {
        });
    }

    private changeNodeStatus(nodeData: NodeDataInterface): Observable<any> {
        const node = this.graph.getCellById(nodeData.id);
        if (node == null) {
            return of(nodeData);
        }
        let backEdge = null;
        if (nodeData['backIncomeId']) { // 如果有回退
            const source = (this.graph.getCellById(nodeData['backIncomeId']) as Edge).target;
            const target = (this.graph.getCellById(nodeData['incomeId']) as Edge).source
            backEdge = this.graph.createEdge({shape: 'dag-edge', source, target});
            backEdge.attr('line/strokeDasharray', 5);
            backEdge.attr('line/stroke', '#5F95FF');
            backEdge.attr('line/style/animation', 'running-line 30s infinite linear')
            this.graph.addEdge(backEdge);
        }
        const data = node.getData();
        const edge = this.graph.getCellById(nodeData.incomeId);
        if (edge == null) {
            return of(nodeData);
        }
        // 先标记为运行中
        edge.attr('line/strokeDasharray', 5);
        edge.attr('line/stroke', '#5F95FF');
        edge.attr('line/style/animation', 'running-line 30s infinite linear')
        node.setData({
            ...data, status: 'running'
        })
        // 过一会儿后虚线变成实线，显示真实的结果
        return timer(1000).pipe(switchMap(() => {
            if (backEdge) {
                this.graph.removeEdge(backEdge.id); // 删除回退线
            }
            if (nodeData.status == "running") {
                return of(nodeData);
            }
            edge.attr('line/strokeDasharray', '');
            edge.attr('line/style/animation', '')
            if (nodeData.status == "success") {
                edge.attr('line/stroke', '#17ad37');
            } else if (nodeData.status == "failed") {
                edge.attr('line/stroke', '#ea0606');
            }
            node.setData({
                ...data,
                status: nodeData.status
            });
            return of(nodeData);
        }));
    }

    /**
     * 从json转换成流程图
     * @param data
     */
    resetCells(data: Cell.Metadata[]) {
        const cells: Cell[] = []
        data.forEach((item) => {
            if (item.shape.endsWith('node')) {
                cells.push(this.graph.createNode(item))
            } else {
                cells.push(this.graph.createEdge(item))
            }
        })
        this.graph.resetCells(cells);
    }


    /**
     * 保存edge配置
     */
    saveEdge() {
        const attrs: any = {label: {}};
        if (this.edgeLabel != null) {
            attrs.label.text = this.edgeLabel;
        }
        if (this.edgeCondition != null) {
            this.cell.getData()['condition'] = this.edgeCondition;
        }
        this.cell.getData()['label'] = this.edgeLabel;
        (this.cell as Edge).setLabels({attrs})
        this.visible = false;
        this.cdr.detectChanges();
    }

    removeEdge($event: MouseEvent) {
        this.graph.removeEdge(this.cell.id);
    }

    changeVertices($event: MouseEvent) {
        if (this.cell != null && !this.cell.hasTool('vertices')) {
            this.cell.addTools('vertices');
        }
    }
}
