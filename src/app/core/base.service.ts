import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import * as _ from "lodash"
import {inject} from "@angular/core";

export abstract class BaseService {
    protected http: HttpClient;

    constructor(protected baseUrl: string) {
        this.http = inject(HttpClient);
    }

    query(params: any): Observable<any> {
        return this.http.get(this.baseUrl, {params: params});
    }

    queryById(id: any): Observable<any> {
        return this.http.get(`${this.baseUrl}/${id}`);
    }

    remove(id: any): Observable<any> {
        return this.http.delete(`${this.baseUrl}?id=${id}`);
    }

    save(data: any): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }

    update(data: any): Observable<any> {
        return this.http.put(this.baseUrl, data);
    }

    // 根据是否有id来判断是用save还是update
    saveOrUpdate(data: any): Observable<any> {
        return _.isEmpty(data.id) && !_.isNumber(data.id) ? this.save(data) : this.update(data);
    }
}
