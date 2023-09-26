import {Injectable} from '@angular/core';
import {BaseService} from "../../../core/base.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProcessService extends BaseService {

    constructor() {
        super("/api/process-definition")
    }

    /**
     * 部署流程定义
     * @param id
     * @param status
     */
    deploy(data: any): Observable<any> {
        return this.http.put("/api/process-definition/deploy", data);
    }

    /**
     * 查询工作流的权限
     * @param id
     */
    findPermission(id): Observable<any> {
        return this.http.get(`/api/process-definition/detail/permission?id=${id}`);
    }

    /**
     * 启动流程
     */
    startInstance(data: any): Observable<any> {
        return this.http.post("/api/process", data);
    }

    /**
     * 查询待办任务
     * @param queryParams
     */
    queryTodo(queryParams: any) {
        return this.http.get("/api/process-task/todo-list", {params: queryParams});
    }

    /**
     * 查询任务审批历史
     * @param instanceId
     */
    queryTaskAuditList(instanceId: string): Observable<any> {
        return this.http.get(`/api/process-task/audit-list?instanceId=${instanceId}`)
    }

    /**
     * 提交任务
     * @param auditData
     */
    handleTask(auditData: any) {
        return this.http.post("/api/process-task", auditData);
    }

    /**
     * 查看我的申请
     * @param queryParams
     */
    queryInstance(queryParams: any): Observable<any> {
        return this.http.get("/api/process-instance", {params: queryParams})
    }

    /**
     * 查找流程实例的详情
     * @param id
     */
    findInstanceDetail(id: any) {
        return this.http.get("/api/process-instance/detail", {params: {id: id}})
    }

    /**
     * 认领任务
     * @param taskId
     */
    claim(taskId: string) {
        return this.http.post("/api/process-task/claim", {taskId: taskId});
    }

    /**
     * 指派任务
     * @param value
     */
    assign(value: any): Observable<any> {
        return this.http.post("/api/process-task/assign", value);
    }

    /**
     * 判断当前用户是否有审批权限
     * @param taskId
     */
    judgePermission(taskId): Observable<any> {
        return this.http.get("/api/process-task/auth", {params: {id: taskId}})
    }

    /**
     * 查找form实例
     */
    findFormInstance(id: string): Observable<any> {
        return this.http.get("/api/forms/instance", {params: {id: id}})
    }

    currentUserDefinitions(keyword: string): Observable<any> {
        return this.http.get('/api/process-definition/list/current-user', {params: {keyword}})
    }

    /**
     * es索引查询
     * @param page
     * @param size
     * @param params
     */
    queryIndex(page: any, size: any, params: any): Observable<any> {
        return this.http.post(`/api/process-instance-index/query?page=${page}&size=${size}`, params);
    }

    /**
     * 导出流程管理的查数数据
     * @param bodyParams
     */
    downloadIndex(bodyParams: any): Observable<any> {
        return this.http.post("/api/process-instance-index/download", bodyParams);
    }

    /**
     * 撤销流程
     * @param id
     */
    cancel(id): Observable<any> {
        return this.http.put("/api/process/cancel?id=" + id, null);
    }

    /**
     * 恢复失败的作业
     * @param taskId
     */
    recover(taskId): Observable<any> {
        return this.http.post(`/api/process-task/recover?taskId=${taskId}`, null);
    }
}
