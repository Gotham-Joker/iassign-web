import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class SysMessageService {

    constructor(private http: HttpClient) {
    }

    queryMessage(params: any): Observable<any> {
        return this.http.get("/api/message", {params: params});
    }

    markAsRead(msgId: any): Observable<any> {
        if (msgId == null) {
            msgId = "";
        }
        return this.http.put(`/api/message?id=${msgId}`, null);
    }
}