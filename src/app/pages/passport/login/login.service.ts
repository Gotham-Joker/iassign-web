import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {StartupService} from "../../../core/startup.service";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient, private startupSvc: StartupService) {
    }

    public login(loginRequest: { id: string, password: string }): Observable<any> {
        return this.http.post('/login', loginRequest).pipe(
            mergeMap((res: any) => {
                // 登录成功，存token
                localStorage.setItem('token', res.data.accessToken);
                return this.startupSvc.load(); // 登录成功，加载应用数据
            })
        );
    }
}
