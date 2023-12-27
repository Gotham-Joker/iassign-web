import {HttpClient} from "@angular/common/http";
import {of, zip} from "rxjs";
import {DagDataServiceInterface} from "../../../../dag/dag-data-service.interface";


export class DagDataService implements DagDataServiceInterface {
    private userCaches: any[] = [];
    private roleCaches: any[] = [];

    constructor(private http: HttpClient) {
        this.init();
    }

    loadUsers() {
        return of(this.userCaches);
    };

    loadRoles() {
        return of(this.roleCaches);
    };

    private init() {
        zip(this.http.get('/api/users/list'), this.http.get('/api/roles/list'))
            .subscribe(([userResp, roleResp]) => {
                const userList = (userResp as any).data;
                const userCaches = [];
                userCaches.push({label: "{申请人}", value: '{starter}'})
                for (let i = 0; i < userList.length; i++) {
                    const user = userList[i];
                    userCaches.push({label: user.username + '(' + user.id + ')', value: user.id})
                }
                this.userCaches = userCaches;
                const roleList = (roleResp as any).data;
                const roleCaches = [];
                roleCaches.push({label: '{上一处理人的主管}', value: '{master}'})
                roleCaches.push({label: '{上一处理人的副主管}', value: '{vMaster}'})
                roleCaches.push({label: '{上一处理人的分管}', value: '{leader}'})
                roleCaches.push({label: '{上一处理人的副分管}', value: '{vLeader}'})
                for (let i = 0; i < roleList.length; i++) {
                    const role = roleList[i];
                    roleCaches.push({label: role.name, value: role.id})
                }
                this.roleCaches = roleCaches;
            })
    }
}
