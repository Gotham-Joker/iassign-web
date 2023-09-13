import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyCheckbox} from "./dy-checkbox";

@Component({
  selector: 'dy-checkbox-config',
  templateUrl: './dy-checkbox-config.html'
})
export class DyCheckboxConfig implements OnInit, DyConfigComponent<DyCheckbox> {
  ref: DyCheckbox;
  config: any;

  constructor() {
  }

  ngOnInit(): void {
    this.config = this.ref.config;
  }

  optionChange(ev: any) {
    this.ref.value = null;
  }

}
