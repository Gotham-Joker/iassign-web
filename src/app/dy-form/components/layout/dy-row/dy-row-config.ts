import {Component, OnInit} from '@angular/core';
import {DyRow} from "./dy-row";
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
    selector: 'dy-row-config',
    templateUrl: './dy-row-config.html',
    standalone: true,
    imports: [NzTabsModule, NzFormModule, NzGridModule, NzButtonModule, NzIconModule, NzPopoverModule, NzInputNumberModule, FormsModule, NzRadioModule]
})
export class DyRowConfig implements OnInit, DyConfigComponent<DyRow> {
  ref: DyRow;

  constructor() {
  }

  ngOnInit(): void {
  }

}
