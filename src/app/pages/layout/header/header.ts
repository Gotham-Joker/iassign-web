import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, NgZone,
    OnDestroy,
    OnInit, TemplateRef, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {StartupService} from "../../../core/startup.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {SysMessageService} from "../sys-message.service";
import {environment} from "../../../../environments/environment";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Observable, of, switchMap} from "rxjs";
import {DiffTimePipe} from '../../../core/diff-time/diff-time.pipe';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NgIf, NgFor, NgTemplateOutlet} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {KeywordSearch} from '../keyword-search/keyword-search';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';


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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NzBreadCrumbModule, RouterLink, KeywordSearch, NzDropDownModule, NzBadgeModule, NzButtonModule, NzIconModule, NgIf, NzTabsModule, NzSpinModule, NgFor, NgTemplateOutlet, NzEmptyModule, NzMenuModule, NzAvatarModule, NzDividerModule, DiffTimePipe]
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
                private cdr: ChangeDetectorRef,
                private zone: NgZone) {
    }

    ngOnInit(): void {
        this.userInfo = this.startupSvc.userInfo || {};
        this.queryMessage().subscribe(() => this.cdr.markForCheck());
        this.registerSSE();
    }

    logout() {
        localStorage.removeItem("token");
        this.http.get('/api/logout').subscribe(res => {
            localStorage.removeItem("token");
            this.router.navigateByUrl('/passport/login');
        })
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
                return of(this.messages);
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
                    this.queryMessage().subscribe((data: any) => {
                        // 如果通知栏不是打开状态，那么给用户提个醒
                        if (!this.visible && data != null && data.length > 0) {
                            this.notice.template(this.noticeTpl, {nzData: data[0], nzDuration: 10_000})
                        }
                        this.cdr.detectChanges();
                    });
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
                })).subscribe(() => this.cdr.detectChanges());
        }
    }

    clearMessage() {
        // 模拟清空
        this.loading = true;
        this.sysMessageSvc.markAsRead(null).pipe(switchMap(() => {
            return this.queryMessage();
        })).subscribe(() => this.cdr.detectChanges());
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
            /* fix：修复问题。
            * 因为当前组件采用onPush策略，所以导航要手动放回angular中运行，
            * 否则其他模块的变更检查可能会有异常，例如导航进入流程详情页后，点击"查看流程图"按钮会报错说dagContainer是undefined，无法resetCells
            * */
            this.zone.run(() => {
                this.router.navigate(['/process/process-detail'], {queryParams: {id: link}});
            })
        }
    }
}
