import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyDatepicker} from "./dy-datepicker";
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
    selector: 'dy-datepicker-config',
    templateUrl: './dy-datepicker-config.html',
    standalone: true,
    imports: [NzTabsModule, NzGridModule, NzFormModule, NzInputModule, FormsModule, NzInputNumberModule, NzSwitchModule, NzButtonModule, NzWaveModule]
})
export class DyDatepickerConfig implements OnInit, DyConfigComponent<DyDatepicker> {
  ref: DyDatepicker;
  config: any;

  constructor() {
  }

  ngOnInit(): void {
    this.config = this.ref.config;
  }

}
