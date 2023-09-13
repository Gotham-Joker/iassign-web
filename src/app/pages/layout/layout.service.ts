import {Injectable, NgZone} from '@angular/core';
import {Subject, Subscription, timer} from "rxjs";
import {mergeMap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private collapsed: Subject<boolean> = new Subject();
    private subscription: Subscription;

    constructor(private zone: NgZone) {
    }

    public next(val: boolean) {
        this.zone.runOutsideAngular(() => {
            this.collapsed.next(val)
        })
    }

    public subscribe(next?: (value: number) => void, error?: (error: any) => void, complete?: () => void) {
        this.zone.runOutsideAngular(() => {
            // 因为菜单伸缩要0.3秒的时间，所以设置300ms的延时
            this.subscription = this.collapsed.pipe(mergeMap(() => timer(300))).subscribe(next, error, complete);
        })
    }

    public unsubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
