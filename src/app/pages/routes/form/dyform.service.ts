import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {BaseService} from "../../../core/base.service";

@Injectable({
    providedIn: 'root'
})
export class DyformService extends BaseService {

    constructor() {
        super('/api/forms')
    }

    /**
     * 根据id查找表单
     * @param id
     */
    override queryById(id: any): Observable<any> {
        return this.http.get(`/api/forms/findById?id=${id}`);
    }


}
