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
     * @param data
     */
    deploy(data: any): Observable<any> {
        return this.http.put("/api/process-definition/deploy", data);
    }

    /**
     * 查询工作流的权限
     * @param id
     */
    findDefinitionDetail(id): Observable<any> {
        return this.http.get(`/api/process-definition/detail?id=${id}`);
    }

    /**
     * 启动流程
     */
    startInstance(data: any): Observable<any> {
        return this.http.post("/api/process", data);
    }

    /**
     * 退回申请人以后，申请人重新启动流程
     */
    restartInstance(data: any): Observable<any> {
        return this.http.put("/api/process", data);
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
    findInstanceDetail(id: any): Observable<any> {
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
     * @param lastId
     * @param score
     * @param size
     * @param params
     */
    queryIndex(lastId: string, score: string, size: any, params: any): Observable<any> {
        return this.http.post(`/api/process-instance-index/query?lastId=${lastId}&score=${score}&size=${size}`, params);
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
     * 恢复失败节点
     * @param taskId
     */
    recover(taskId): Observable<any> {
        return this.http.post(`/api/process-task/recover?taskId=${taskId}`, null);
    }

    /**
     * 查看流程图定义
     * @param defId
     */
    dag(defId: any): Observable<any> {
        return this.http.get(`/api/process-definition/dag?ruId=${defId}`);
    }

    /**
     * 查询已办事项
     */
    checkedList(queryParams: any): Observable<any> {
        return this.http.get('/api/process-task/checked-list', {params: queryParams});
    }

    /**
     * 上传流程定义
     * @param file
     */
    upload(file): Observable<any> {
        const form = new FormData();
        form.append('file', file);
        return this.http.post("/api/process-definition/in", form);
    }

    /**
     * 任务取回
     * @param taskId
     */
    reclaim(taskId) {
        return this.http.post('/api/process-task/reclaim?taskId=' + taskId, null);
    }
}
