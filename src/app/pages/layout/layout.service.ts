/*
 * MIT License
 *
 * Copyright (c) 2024 Hongtao Liu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

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
