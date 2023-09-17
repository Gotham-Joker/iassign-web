import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyInput} from "./dy-input";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
    selector: 'dy-input-config',
    templateUrl: './dy-input-config.html',
    standalone: true,
    imports: [NzTabsModule, NzFormModule, NzGridModule, NzInputModule, FormsModule, NzInputNumberModule, NzSwitchModule, NzButtonModule, NzWaveModule, NzDividerModule]
})
export class DyInputConfig implements OnInit, DyConfigComponent<DyInput> {
  ref: DyInput;

  config: any;

  constructor() {
  }

  ngOnInit(): void {
    this.config = this.ref.config;
  }


}
