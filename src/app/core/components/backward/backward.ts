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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
    selector: 'app-backward',
    templateUrl: './backward.html',
    styles: [`.backward-text {
      color: black
    }

    .backward-text:hover {
      color: rgb(24, 144, 255);
    }

    .backward-btn {
      border: 1px solid #efefef;
      color: rgb(24, 144, 255);
    }

    .backward-btn:hover {
      box-shadow: 0 10px 12px -8px rgba(0, 0, 0, .2);
    }
    `],
    standalone: true,
    imports: [NzButtonModule, NzWaveModule, NzIconModule]
})
export class Backward implements OnInit {
    // 用浏览器默认的返回行为
    @Input()
    isBack: boolean = true;
    @Input()
    backText: string = "返回上一页";

    @Output()
    onBack: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit(): void {
    }

    backward() {
        if (this.isBack) {
            history.back();
        } else {
            this.onBack.emit('');
        }
    }
}
