import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class RoleUserService {

    constructor(private http: HttpClient) {
    }

    /**
     * 查询指定角色下有哪些用户
     */
    query(queryParams: any): Observable<any> {
        return this.http.get('/api/role-users', {params: queryParams});
    }
}