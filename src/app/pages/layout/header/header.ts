import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit, TemplateRef, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {StartupService} from "../../../core/startup.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {SysMessageService} from "../sys-message.service";
import {environment} from "../../../../environments/environment";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Observable, of, switchMap} from "rxjs";


@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss'],
    animations: [
        trigger('removed', [
            transition('* => removed', [
                animate('.35s ease-out', style({transform: 'translateX(-100%)'}))
            ])
        ])
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
    userInfo: any;

    messages: any[] = [];
    showAll: boolean = false;
    showDot: boolean = false;
    loading: boolean = false;
    total: number = 0; // 总的消息数
    source: EventSource;
    visible: boolean = false;
    @ViewChild('noticeTpl', {read: TemplateRef})
    noticeTpl: TemplateRef<any>;

    constructor(private http: HttpClient, private router: Router,
                private notice: NzNotificationService,
                private startupSvc: StartupService,
                private sysMessageSvc: SysMessageService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.userInfo = this.startupSvc.userInfo || {};
        this.queryMessage().subscribe();
        this.registerSSE();
    }

    logout() {
        const token = localStorage.getItem("token");
        localStorage.removeItem("token");
        window.location.href = environment.SERVER_URL + "/ssic/logout?token=" + token;
       /* this.http.get('/api/logout').subscribe(res => {
            localStorage.removeItem("token");
            this.router.navigateByUrl('/passport/login');
        })*/
    }

    /**
     * 查询站内信
     */
    queryMessage(): Observable<any> {
        this.loading = true;
        // 收到站内信推送，调用接口取数据，每次最多显示5条数据
        return this.sysMessageSvc.queryMessage({page: 1, size: 5, status_le: 1, createTime_odd: 1})
            .pipe(switchMap(res => {
                const data = res.data;
                this.messages = data.list;
                this.showAll = data.total > 5;
                this.total = data.total;
                this.showDot = this.messages?.length > 0;
                this.loading = false;
                // 手动刷新UI
                this.cdr.detectChanges();
                return of(res);
            }))
    }

    /**
     * 注册SSE
     * @private
     */
    private registerSSE() {
        if (window.EventSource) {
            let msg = '';
            const token = localStorage.getItem('token');
            const source = new EventSource(`${environment.SERVER_URL}/message/${token}`);
            this.source = source;
            source.onmessage = (e) => {
                msg = e.data;
                // 服务器告知关闭连接
                if (msg == 'close') {
                    this.closeSource();
                } else {
                    this.queryMessage().subscribe(() => {
                        // 如果通知栏不是打开状态，那么给用户提个醒
                        if (!this.visible && this.messages != null && this.messages.length > 0) {
                            this.notice.template(this.noticeTpl, {nzData: this.messages[0], nzDuration: 10_000})
                        }
                    })
                }
            }
            source.onerror = (err) => {
                // 断线会重连，服务器那边告知关闭就别再重连了
                if (msg == 'close') {
                    this.closeSource();
                }
            }
            source.onopen = (e) => {
            }
        }
    }

    /**
     * 移除元素动画是否被触发，如果要触发这个动画，请调用this.removeItem方法
     * 动画：在component最上面的代码有定义
     * @param item
     */
    isRemoved(item: any): string {
        return item?.['removed'];
    }

    /**
     * 触发移除元素的动画
     * @param item
     */
    removeItem(item: any) {
        item['removed'] = 'removed';
    }

    /**
     * 移除动画触发完成后的逻辑
     * @param $event
     * @param idx
     */
    removedDone($event: any, idx: number) {
        if ($event.toState == 'removed') {
            // 删除元素
            const msgId = this.messages[idx].id;
            this.messages.splice(idx, 1);
            // 然后重新加载列表
            this.sysMessageSvc.markAsRead(msgId)
                .pipe(switchMap(() => {
                    return this.queryMessage();
                })).subscribe();
        }
    }

    clearMessage() {
        // 模拟清空
        this.loading = true;
        this.sysMessageSvc.markAsRead(null).pipe(switchMap(() => {
            return this.queryMessage();
        })).subscribe();
    }

    /**
     * 关闭sse的session
     */
    ngOnDestroy(): void {
        this.closeSource();
    }

    closeSource() {
        if (this.source) {
            this.source.close();
            this.source = null;
        }
    }

    routeToLink(link: any) {
        if (link != null && link != "") {
            this.router.navigate(['/process/process-detail'], {queryParams: {id: link}});
        }
    }
}