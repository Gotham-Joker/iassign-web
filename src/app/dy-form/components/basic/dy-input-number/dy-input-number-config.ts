import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyInputNumber} from "./dy-input-number";
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
    selector: 'dy-input-number-config',
    templateUrl: './dy-input-number-config.html',
    standalone: true,
    imports: [NzTabsModule, NzGridModule, NzFormModule, NzInputModule, FormsModule, NzInputNumberModule, NzSwitchModule, NzButtonModule, NzWaveModule, NzDividerModule]
})
export class DyInputNumberConfig implements OnInit, DyConfigComponent<DyInputNumber> {
  ref: DyInputNumber;

  config: any;

  constructor() {
  }

  ngOnInit(): void {
    this.config = this.ref.config;
  }


}
