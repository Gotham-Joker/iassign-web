import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from "@angular/common/http";
import {Observable, of, switchMap} from "rxjs";
import  _ from "lodash"

@Injectable()
export class DictionaryService {
    private data: any = {};
    private http: HttpClient;

    constructor(private httpBackend: HttpBackend) {
        this.http = new HttpClient(httpBackend);
    }

    /**
     * 加载应用字典数据，可以放在前端的dictionary.json文件中，不需要从后端接口访问
     * 用到的时候直接使用管道操作符即可
     * 例如{{item.status|dict:'instanceStatus'}}自动把RUNNING变为"运行中"
     */
    load(): Observable<any> {
        return this.http.get('/assets/json/dictionary.json').pipe(switchMap((res: any) => {
            this.data = res;
            return of(1);
        }));
    }

    translate(value: any, args: any): string {
        if (value == null) {
            return value;
        }
        if (_.isArray(args)) {
            let attribute = this.data[args[0]][value];
            for (let i = 1; i < args.length; i++) {
                if (attribute[args[1]] == null) {
                    return 'UNKNOWN';
                }
                attribute = attribute[args[i]];
            }
            return attribute;
        }
        return this.data[args][value] ?? 'UNKNOWN';
    }
}
