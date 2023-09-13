import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichText} from './rich-text';


@NgModule({
    declarations: [
        RichText
    ],
    imports: [
        CommonModule
    ],
    exports: [
        RichText
    ]
})
export class RichTextModule {
}
