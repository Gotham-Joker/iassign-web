import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 文件上传
 */
@Injectable({
    providedIn: 'root'
})
export class UploadService {
    constructor(private http: HttpClient) {
    }
    upload(file: any): Observable<any> {
        const form = new FormData();
        form.append('file', file);
        return this.http.post("/upload", form);
    }
}
