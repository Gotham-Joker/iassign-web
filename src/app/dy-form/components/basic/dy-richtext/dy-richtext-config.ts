import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyRichtext} from "./dy-richtext";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzWaveModule} from "ng-zorro-antd/core/wave";

@Component({
    selector: 'dy-richtext-config',
    templateUrl: 'dy-richtext-config.html',
    standalone: true,
    imports: [NzTabsModule, NzGridModule, NzFormModule, NzInputModule, FormsModule, NzInputNumberModule, NzSwitchModule, NzButtonModule, NzWaveModule]
})

export class DyRichtextConfig implements  OnInit, DyConfigComponent<DyRichtext> {
    ref: DyRichtext;
    config: any = {

    };

    constructor() {
    }

    ngOnInit(): void {
        this.config = this.ref.config;
    }

}