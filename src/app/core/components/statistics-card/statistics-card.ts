import {
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {Chart} from "@antv/g2";

@Component({
    selector: 'app-statistics-card',
    templateUrl: './statistics-card.html',
    styleUrls: ['./statistics-card.scss']
})
export class StatisticsCard implements OnInit, OnChanges, AfterViewInit {
    // 标题
    @Input()
    subtitle: any;
    // 数据
    @Input()
    data: any;
    //增长率，输入的时候应当输入小数点，会自动转化成百分比
    @Input()
    growth: any;
    // 描述
    @Input()
    desc: any;
    // 增长还是下降
    isRise: boolean;
    @Input()
    loading: boolean = false;
    // 折线图数据
    @Input()
    chartData: any[] = [];
    // 坐标轴取chartData的哪两个field
    @Input()
    position: string = 'date*value';

    @ViewChild('miniChart', {read: ElementRef})
    miniChartContainer: ElementRef;
    private miniChart: Chart;

    constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes['chartData'].firstChange) {
            this.render()
        }
        this.isRise = this.growth >= 0;
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        // new Chart的地方要runOutsideAngular，因为那是第三方组件
        // 并不原生支持angular，其中注册的各种监听事件会频繁触发angular的变更检测
        this.zone.runOutsideAngular(() => {
            this.miniChart = new Chart({
                container: this.miniChartContainer.nativeElement,
                autoFit: true,
                height: this.miniChartContainer.nativeElement.parentNode.offsetHeight
            })
            this.miniChart.scale(this.position.split("*")[1], {nice: true});
            this.miniChart.axis(false); // 不显示坐标
            this.miniChart.legend(false); // 关闭图例
            this.miniChart.tooltip({
                shared: true, position: 'top',
                itemTpl: '<li style="padding:0px;margin:12px 0px;" data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span><span>{value}</span></li>'
            });
            this.miniChart.interaction('active-region');
            this.miniChart.line().position(this.position)
        })
        // .adjust('stack');
    }

    render() {
        this.zone.runOutsideAngular(() => {
            this.miniChart.data(this.chartData);
            this.miniChart.render();
        });
    }

}
