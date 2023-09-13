import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyInputNumber} from "./dy-input-number";

@Component({
  selector: 'dy-input-number-config',
  templateUrl: './dy-input-number-config.html'
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
