import {Injectable} from '@angular/core';
import {BaseService} from "../../../../core/base.service";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MenuService extends BaseService {

    constructor() {
        super("/api/menus");
    }

    findParents(): Observable<any> {
        return this.http.get(`${this.baseUrl}/parents`);
    }

}
