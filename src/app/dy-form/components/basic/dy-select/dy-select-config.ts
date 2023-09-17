import {Component, OnInit} from '@angular/core';
import {DySelect} from "./dy-select";
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
    selector: 'dy-select-config',
    templateUrl: './dy-select-config.html',
    standalone: true,
    imports: [NzTabsModule, NzGridModule, NzFormModule, NzInputModule, FormsModule, NzInputNumberModule, NzSwitchModule, NzButtonModule, NzWaveModule, NzDividerModule]
})
export class DySelectConfig implements OnInit,DyConfigComponent<DySelect> {
  ref: DySelect;
  config: any;

  constructor() {
  }

  ngOnInit(): void {
    this.config = this.ref.config;
  }

  optionChange(ev: any) {
    this.ref.config.value = null;
  }

}
