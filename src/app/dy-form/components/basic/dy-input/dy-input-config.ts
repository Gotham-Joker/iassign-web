import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyInput} from "./dy-input";

@Component({
  selector: 'dy-input-config',
  templateUrl: './dy-input-config.html'
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
