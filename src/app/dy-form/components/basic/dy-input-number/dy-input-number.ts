import {Component,  OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {formatNumber} from "@angular/common";

@Component({
  selector: 'dy-input-number',
  templateUrl: './dy-input-number.html',
  styles: [':host{display: block;}']
})
export class DyInputNumber implements OnInit {

  // 默认配置
  config: any = {
    type: 'number',
    noColon: false,
    label: '数字',
    required: false,
    placeholder: '',
    value: 0
  };
  status: any;  // 校验结果
  formatter: (value: number) => string | number = (value: number) => {
    return formatNumber(value, 'en_US', '1.0-6');
  };
  parser: (value: string) => string = (value: string) => {
    return value.replaceAll(",", '');
  };


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
    validators.push(Validators.pattern(this.config.regex));
    // 开始校验
    const control = new FormControl(this.config.value, validators);
    if (control.invalid) {
      this.status = 'error';
    } else {
      this.status = null;
    }
  }


}
