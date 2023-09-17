import {Component, OnInit} from '@angular/core';
import { FormControl, Validators, FormsModule } from "@angular/forms";
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgIf } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
    selector: 'dy-textarea',
    templateUrl: './dy-textarea.html',
    styles: [':host{display: block;}'],
    standalone: true,
    imports: [NzGridModule, NzFormModule, NgIf, NzInputModule, FormsModule]
})
export class DyTextarea implements OnInit {
  config: any = {
    type: 'textarea',
    noColon: false,
    label: '文本',
    dyColSpan:12,
    required: false,
    placeholder: '',
    value: ''
  };
  status: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  validate() {
    // 添加校验函数
    const validators = [];
    if (this.config.required) {
      const requiredFn = (ctl: any) => {
        return Validators.required(ctl);
      };
      validators.push(requiredFn);
    }
    // 开始校验
    const control = new FormControl(this.config.value, validators);
    if (control.invalid) {
      this.status = 'error';
    } else {
      this.status = null;
    }
  }
}
