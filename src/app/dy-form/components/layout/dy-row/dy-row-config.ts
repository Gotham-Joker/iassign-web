import {Component, OnInit} from '@angular/core';
import {DyRow} from "./dy-row";
import {DyConfigComponent} from "../../../interface/dy-form-interface";

@Component({
  selector: 'dy-row-config',
  templateUrl: './dy-row-config.html'
})
export class DyRowConfig implements OnInit, DyConfigComponent<DyRow> {
  ref: DyRow;

  constructor() {
  }

  ngOnInit(): void {
  }


  change($event: any) {
    const arr = [];
    for (let i = 0; i < $event; i++) {
      arr.push(i);
    }
    this.ref.config.cols = arr as any;
  }
}
