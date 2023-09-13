import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyTextarea} from "./dy-textarea";

@Component({
    selector: 'dy-textarea-config',
    templateUrl: './dy-textarea-config.html'
})
export class DyTextareaConfig implements OnInit, DyConfigComponent<DyTextarea> {
    ref: DyTextarea;

    config: any = {

    };

    constructor() {
    }

    ngOnInit(): void {
        this.config = this.ref.config;
    }


}
