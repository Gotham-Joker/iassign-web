import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../../core/base.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DeptService extends BaseService {

    constructor() {
        super("/api/depts");
    }

}
