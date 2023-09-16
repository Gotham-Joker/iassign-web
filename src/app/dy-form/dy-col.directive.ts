import {
    Directive,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core';

@Directive({selector: '[dyCol]'})
export class DyColDirective implements OnChanges, OnDestroy {
    public componentRef;
    @Input()
    dyCol: any;
    @Input()
    dyColIndex: number;

    @Input()
    dyColCreate: (ctx: any, index: number, ev: any, dyCol?: any) => void;
    @Input()
    dyColDestroy: (ctx: any, index: number) => void;

    constructor(protected viewContainerRef: ViewContainerRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dyCol'] !== undefined) {
            this.viewContainerRef.clear();
            this.componentRef = null;
            if (this.dyCol['comp']) {
                this.componentRef = this.viewContainerRef.createComponent(this.dyCol['comp']);
                this.componentRef.onDestroy(() => this.dyColDestroy(this.dyCol.ctx, this.dyColIndex));
                if (this.dyColCreate) {
                    this.dyColCreate(this.dyCol.ctx, this.dyColIndex, this.componentRef, this.dyCol);
                }
            }
        }
    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy()
        }
    }

}