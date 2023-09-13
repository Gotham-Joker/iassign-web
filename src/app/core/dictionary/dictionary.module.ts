import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DictPipe} from "./dict.pipe";


@NgModule({
    declarations: [DictPipe],
    imports: [
        CommonModule
    ],
    exports: [DictPipe]
})
export class DictionaryModule {
}
