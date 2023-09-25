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
     * 表单定义查找，并替换占位符
     * @param id
     */
    defContext(id:any):Observable<any>{
        return this.http.get(`${this.baseUrl}/def/context?id=${id}`);
    }

}
