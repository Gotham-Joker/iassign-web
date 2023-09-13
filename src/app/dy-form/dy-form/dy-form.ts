import {Component,  Input,  OnInit} from '@angular/core';
import {HttpBackend, HttpClient} from "@angular/common/http";
import {mergeMap, of} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {formatNumber} from "@angular/common";

@Component({
  selector: 'dy-form',
  templateUrl: './dy-form.html',
})
export class DyForm implements OnInit {
  @Input()
  form: any = {};
  private http: HttpClient;
  dateFormat = 'yyyy-MM-dd';
  dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';

  @Input()
  readonly: boolean = false;

  numberFormatter: (value: number) => string | number = (value: number) => {
    return formatNumber(value, 'en_US', '1.0-6');
  };
  numberParser: (value: string) => string = (value: string) => {
    return value.replaceAll(",", '');
  };


  constructor(private httpBackend: HttpBackend) {
    this.http = new HttpClient(httpBackend);
  }

  ngOnInit(): void {
  }

  upload(config: any) {
    const url = config.url;
    const key = config.res;
    const varName = config.name;
    return (file, fileList) => {
      const form = new FormData();
      form.append(varName, file);
      return this.http.post(url, form).pipe(mergeMap((res: any) => {
        const file = res[key]
        config.value = [...config.value, file];
        return of(false);
      }))
    };
  }

  validate(): boolean {
    let successful = true;
    const children = this.form.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type == 'row') {
        const rowChildren = child.children;
        for (let j = 0; j < rowChildren.length; j++) {
          const rowChild = rowChildren[j];
          if (!this.validateControl(rowChild)) {
            successful = false;
          }
        }
      } else {
        if (!this.validateControl(child)) {
          successful = false;
        }
      }
    }
    return successful;
  }

  private validateControl(config: any): boolean {
    const validators = [];
    // 添加校验函数
    if (config.required) {
      const requiredFn = (ctl: any) => {
        return Validators.required(ctl);
      };
      validators.push(requiredFn);
    }
    if (config.regex) {
      validators.push(Validators.pattern(config.regex));
    }
    // 开始校验
    const control = new FormControl(config.value, validators);
    if (control.invalid) {
      config.status = 'error';
      control.markAsDirty();
      control.updateValueAndValidity({onlySelf: true});
      return false;
    } else {
      config.status = '';
      control.markAsDirty();
      control.updateValueAndValidity({onlySelf: true});
      return true;
    }
  }

  checkboxChange($event: boolean, config, item: string) {
    if (config.value == null || config.value == "") {
      config.value = [];
    }
    const indexOf = config.value.indexOf(item);
    if ($event) {
      if (indexOf == -1) {
        config.value.push(item);
      }
    } else {
      if (indexOf != -1) {
        config.value.splice(indexOf, 1);
      }
    }
  }
}
