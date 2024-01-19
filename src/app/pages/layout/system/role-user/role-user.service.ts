import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

/**
 * 角色-用户服务
 */
@Injectable({providedIn: 'root'})
export class RoleUserService {

    constructor(private http: HttpClient) {
    }

    /**
     * 查询拥有指定角色的用户清单
     * @param queryParams
     */
    query(queryParams: any): Observable<any> {
        return this.http.get('/api/role-users', {params: queryParams});
    }

    /**
     * 重新绑定角色和用户
     * @param data
     */
    rebindRoleUsers(data: { roleId: string, delUserIds?: string[], addUserIds?: string[] }[]): Observable<any> {
        return this.http.put('/api/role-users', data);
    }
}