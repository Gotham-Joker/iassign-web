import {Component, OnInit} from '@angular/core';
import {DySelect} from "./dy-select";
import {DyConfigComponent} from "../../../interface/dy-form-interface";

@Component({
  selector: 'dy-select-config',
  templateUrl: './dy-select-config.html'
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
