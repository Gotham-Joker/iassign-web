import {Component, OnInit} from '@angular/core';
import {DyRadio} from "./dy-radio";
import {DyConfigComponent} from "../../../interface/dy-form-interface";

@Component({
  selector: 'dy-radio-config',
  templateUrl: './dy-radio-config.html'
})
export class DyRadioConfig implements OnInit, DyConfigComponent<DyRadio> {
  ref: DyRadio;
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
