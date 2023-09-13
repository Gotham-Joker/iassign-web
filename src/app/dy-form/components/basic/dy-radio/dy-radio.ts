import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'dy-radio',
  templateUrl: './dy-radio.html',
  styles: [':host{display: block;}']
})
export class DyRadio implements OnInit {

  value: any = null;
  // 默认配置
  config: any = {
    type: 'radio',
    noColon: false,
    label: '单选',
    required: false,
    options: 'Apple\nAndroid'
  };
  status: any;  // 校验结果


  constructor() {
  }

  ngOnInit(): void {
  }

  validate() {
    // 添加校验函数
    const validators = [];
    if (null != this.config.required) {
      const requiredFn = (ctl: any) => {
        return Validators.required(ctl);
      };
      validators.push(requiredFn);
    }
    // 开始校验
    const control = new FormControl(this.value, validators);
    if (control.invalid) {
      this.status = 'error';
    } else {
      this.status = null;
    }
  }


}
