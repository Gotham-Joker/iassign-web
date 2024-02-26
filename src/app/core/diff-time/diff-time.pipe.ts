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

import {Pipe, PipeTransform} from '@angular/core';
import dayjs from "dayjs";
import {QUnitType} from "dayjs";


/**
 * 将创建时间润色，例如“几分钟前，几个月前”
 */
@Pipe({
    name: 'diffTime',
    standalone: true
})
export class DiffTimePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        const now = new Date();
        const units: QUnitType[] = ['second', 'minute', 'hour', 'day'];
        const unitI18n: string[] = ['秒前', '分钟前', '小时前','天前'];
        for (let i = units.length - 1; i >= 0; i--) {
            const diff = dayjs(now).diff(dayjs(value), units[i]);
            if (i === 3) {
                if (diff > 7) { // 超过一周显示原始日期
                    return value;
                } else if (diff > 0) { // 否则显示几天前
                    return diff + unitI18n[i];
                }
            }
            if (i === 0 && diff <= 30) {
                return '刚刚';
            }
            if (diff > 0) { // n秒/分/小时前
                return diff + unitI18n[i];
            }
        }
        return value;
    }
}