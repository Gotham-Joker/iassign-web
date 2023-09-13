import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BaseService} from "../../../../core/base.service";

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService {

    constructor() {
        super("/api/users");
    }

    queryBaseInfo(id: string): Observable<any> {
        return this.http.get(`/api/users/base/${id}`);
    }

    setAdmin(id: any, isAdmin: any): Observable<any> {
        const form = new FormData();
        form.append("userId", id);
        form.append("isAdmin", isAdmin);
        return this.http.put(`${this.baseUrl}/set-admin`, form);
    }

}
