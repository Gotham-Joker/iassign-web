/*
 * MIT License
 *
 * Copyright (c) 2024 Hongtao Liu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * DAG外部数据服务，一般是获取审批人列表，例如用户和角色
 * 这个服务最好是注册在根组件
 */
import {Observable} from "rxjs";
import {InjectionToken} from "@angular/core";

export const DAG_DATA_SVC: InjectionToken<DagDataServiceInterface> = new InjectionToken<DagDataServiceInterface>('DAG_DATA_SVC');

export interface SelectOptionInterface {
  label: string,
  value: string,

  [key: string]: string
}

export interface DagDataServiceInterface {
  loadUsers: () => Observable<SelectOptionInterface[]>;
  loadRoles: () => Observable<SelectOptionInterface[]>;
}
