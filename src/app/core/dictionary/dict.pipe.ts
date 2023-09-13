import {Pipe, PipeTransform} from '@angular/core';
import {DictionaryService} from "./dictionary.service";

/**
 * 字典管道
 */
@Pipe({
    name: 'dict',
    pure: true
})
export class DictPipe implements PipeTransform {

    constructor(private dict: DictionaryService) {
    }


    transform(value: any, ...args: unknown[]): any {
        return this.dict.translate(value, args);
    }

}
