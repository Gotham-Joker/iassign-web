import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'dy-upload',
  templateUrl: './dy-upload.html',
  styles: [':host{display: block;}']
})
export class DyUpload implements OnInit {

  value: any = null;
  // 默认配置
  config: any = {
    type: 'upload',
    noColon: false,
    label: '附件',
    name: 'file', // 上传到后端的参数名
    required: false,
    placeholder: ''
  };
  status: any = null;
  fileList: any[] = [];


  constructor() {
  }

  ngOnInit(): void {
  }

  change(ev: any) {
    let fileList = [...ev.fileList];
    fileList = fileList.map(file => {
      if (file.response) {
        file.uid = file.response[this.config.res].id;
        file.url = file.response[this.config.res].url;
        file.name = file.response[this.config.res].name;
      }
      return file;
    });

    this.fileList = fileList;
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
    validators.push(Validators.pattern(this.config.regex));
    // 开始校验
    const control = new FormControl(this.value, validators);
    if (control.invalid) {
      this.status = 'error';
    } else {
      this.status = null;
    }
  }


}
