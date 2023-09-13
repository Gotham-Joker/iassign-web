import {Injectable} from '@angular/core';
import {BaseService} from "../../../../core/base.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RoleService extends BaseService {

    constructor() {
        super('/api/roles');
    }

    findDetails(id: any): Observable<any> {
        return this.http.get(`${this.baseUrl}/${id}/details`);
    }
}
