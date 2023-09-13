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
