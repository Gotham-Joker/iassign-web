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

import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    Input, OnInit
} from '@angular/core';
import { TransferChange, NzTransferModule } from "ng-zorro-antd/transfer";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import * as _ from "lodash";
import {NgStyleInterface} from "ng-zorro-antd/core/types";

@Component({
    selector: 'app-transfer',
    templateUrl: './transfer.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => Transfer),
            multi: true
        }
    ],
    standalone: true,
    imports: [NzTransferModule]
})
export class Transfer implements OnInit, ControlValueAccessor {
    innerValue: string[] = [];
    disabled: boolean = false;
    canChange: boolean = false;
    onChangeCallback: (value: any) => void = (obj: any) => {
    };
    onTouchedCallback: (value: any) => void = (obj: any) => {
    };

    dataSource: any[] = [];
    @Input()
    list: { key: string, title: string, [key1: string]: any }[] = [];
    @Input()
    nzListStyle: NgStyleInterface;

    constructor() {
    }

    ngOnInit(): void {
    }

    change($event: TransferChange) {
        if (this.innerValue == null) {
            return;
        }
        if (!this.canChange) {
            this.canChange = true;
            return;
        }
        if ($event.to == 'right') {
            $event.list.forEach((e: any) => this.innerValue.push(e.key));
            this.onChangeCallback(this.innerValue);
            return;
        }
        $event.list.forEach((e: any) => {
            const index = this.innerValue.indexOf(e.key);
            if (index != -1) {
                this.innerValue.splice(index, 1);
            }
        });
        this.onChangeCallback(this.innerValue);
    }

    filterOption(inputValue: string, item: any): boolean {
        return item.title.indexOf(inputValue) != -1;
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void {
        this.dataSource = _.cloneDeep(this.list); // 每次都从list深拷贝，解决NzTransferComponent无法修改targetKeys的bug
        this.innerValue = obj;
    }

}
