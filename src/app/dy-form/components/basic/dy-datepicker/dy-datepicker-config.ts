import {Component, OnInit} from '@angular/core';
import {DyConfigComponent} from "../../../interface/dy-form-interface";
import {DyDatepicker} from "./dy-datepicker";

@Component({
  selector: 'dy-datepicker-config',
  templateUrl: './dy-datepicker-config.html'
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
