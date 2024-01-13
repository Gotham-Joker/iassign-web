import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";

export declare type GuideLineStep = {
    origin: ElementRef | any, // 气泡弹窗将要附着的元素
    visible?: boolean,
    title: string,
    ok?: string,
    cancel?: string
}

/**
 * 用法:
 * <p>
 * @if(visible){
 *   <app-guideline [steps]="steps" (onFinish)="visible=false"></app-guideline>
 * }
 * </p>
 */
@Component({
    selector: 'app-guideline',
    templateUrl: './guideline.html',
    styles: [
        `.stepMask {
          position: fixed;
          z-index: 998;
          opacity: .5;
          background-color: #1e2022;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
        `
    ]
})
export class Guideline implements OnInit {

    @ViewChild('highlight', {read: TemplateRef, static: true})
    private highlightRef: TemplateRef<any>;
    width: string = '0px';
    height: string = '0px';

    @Input()
    steps: GuideLineStep[] = [];

    @Output()
    onFinish: EventEmitter<any> = new EventEmitter<any>();

    overlayRef: OverlayRef;

    constructor(private overlay: Overlay, private vcf: ViewContainerRef) {
    }

    ngOnInit(): void {
        if (this.steps != null && this.steps.length > 0) {
            for (let i = 0; i < this.steps.length - 1; i++) {
                const step = this.steps[i];
                if (!step.ok) {
                    step.ok = "下一步";
                }
                if (!step.cancel) {
                    step.cancel = "跳过指引";
                }
            }
            const lastStep = this.steps[this.steps.length - 1];
            if (!lastStep.ok) {
                lastStep.ok = "知道了";
            }
            if (!lastStep.cancel) {
                lastStep.cancel = "跳过指引";
            }
            // 显示第一个
            this.steps[0].visible = true;
            this.createHighlight(0);
        }
    }

    // 跳过操作指引
    skipStepTips() {
        this.onFinish.emit(true);
    }

    // 下一个操作指引
    nextStepTips(index: number) {
        if (this.overlayRef) {
            this.destroy();
        }
        if (index + 1 < this.steps.length) {
            this.createHighlight(index + 1);
            this.steps[index].visible = false;
            this.steps[index + 1].visible = true;
        } else {
            this.onFinish.emit(true);
        }
    }

    private createHighlight(index: number) {
        if (index < this.steps.length) {
            const ele = this.steps[index].origin;
            if (ele == null) {
                return;
            }
            const positionStrategy = this.overlay.position().flexibleConnectedTo(ele).withPositions([{
                originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top', offsetY: -10, offsetX: -2
            }]);
            const scrollStrategy = this.overlay.scrollStrategies.reposition();
            this.height = (ele.nativeElement.offsetHeight + 4) + 'px';
            this.width = (ele.nativeElement.offsetWidth + 4) + 'px';
            this.overlayRef = this.overlay.create({positionStrategy: positionStrategy, scrollStrategy: scrollStrategy});
            this.overlayRef.attach(new TemplatePortal(this.highlightRef, this.vcf));
        }
    }

    private destroy() {
        this.overlayRef.detach();
        this.overlayRef.dispose();
    }
}
