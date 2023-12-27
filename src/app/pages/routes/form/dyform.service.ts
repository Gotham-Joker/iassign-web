import {Injectable} from '@angular/core';
import {BaseService} from "../../../core/base.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DyformService extends BaseService {

    constructor() {
        super('/api/forms')
    }

    queryDefContext(formId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/def/context?id=${formId}`);
    }

    upload(file):Observable<any> {
        const form = new FormData();
        form.append('file', file);
        return this.http.post("/api/forms/in", form);
    }
}
