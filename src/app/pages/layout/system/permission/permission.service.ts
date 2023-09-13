import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BaseService} from "../../../../core/base.service";

@Injectable({
    providedIn: 'root'
})
export class PermissionService  extends BaseService{

    constructor() {
        super('/api/permissions');
    }

}
