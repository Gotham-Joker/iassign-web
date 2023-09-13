import {Pipe, PipeTransform} from '@angular/core';
import * as dayjs from "dayjs";
import {QUnitType} from "dayjs";


/**
 * 将创建时间润色，例如“几分钟前，几个月前”
 */
@Pipe({
    name: 'diffTime'
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