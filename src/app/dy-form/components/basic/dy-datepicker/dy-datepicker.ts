import {Component,  OnInit,} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { formatDate} from '@angular/common';

@Component({
  selector: 'dy-datepicker',
  templateUrl: './dy-datepicker.html',
  styles: [':host{display: block;}']
})
export class DyDatepicker implements OnInit {

  value: any = null;
  // 默认配置
  config: any = {
    type: 'datepicker',
    noColon: false,
    label: '日期',
    dyColSpan:12,
    required: false,
    showTime: false
  };
  date: any = null;
  status: any;  // 校验结果
  dateFormat = 'yyyy-MM-dd';
  dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';


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
    const control = new FormControl(this.value, validators);
    if (control.invalid) {
      this.status = 'error';
    } else {
      this.status = null;
    }
  }

  change($event: any) {
    if ($event == null) {
      this.value = null;
      return;
    }
    if (this.config.showTime) {
      this.value = formatDate(this.date, this.dateTimeFormat, 'en_US');
    } else {
      this.value = formatDate(this.date, this.dateFormat, 'en_US');
    }
  }

}
