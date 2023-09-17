import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProcessService} from "../process.service";
import {ActivatedRoute} from "@angular/router";
import {EMPTY, mergeMap, of, switchMap, timer} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {UserService} from "../../../layout/system/user/user.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DyForm} from "../../../../dy-form/dy-form/dy-form";
import {RichText} from "../../../../core/components/rich-text/rich-text";
import {catchError} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import {UploadService} from "../../../../core/upload.service";
import {DagContainer} from "../../../../dag/components/dag-container/dag-container";
import { DiffTimePipe } from '../../../../core/diff-time/diff-time.pipe';
import { DictPipe } from '../../../../core/dictionary/dict.pipe';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { MailSelect } from '../../../../core/components/mail-select/mail-select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { ShotOverlay } from '../../../../core/components/shot-overlay/shot-overlay';
import { ProcessAssign } from '../process-assign/process-assign';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgIf, NgFor } from '@angular/common';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AclDirective } from '../../../../core/acl/acl.directive';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Backward } from '../../../../core/components/backward/backward';

/**
 * 流程审批详情
 * 注意，虽然angular支持通过DomSanitizer绕过html安全检查(预防xss攻击)，
 * 但是最好不要开启
 */
@Component({
    selector: 'app-process-detail',
    templateUrl: './process-detail.html',
    styleUrls: ['./process-detail.scss', '../../../../core/components/rich-text/colors.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [Backward, NzCardModule, AclDirective, NzButtonModule, NzWaveModule, NgIf, NzGridModule, NzIconModule, DyForm, NzTimelineModule, NgFor, NzTagModule, NzAvatarModule, NzModalModule, DagContainer, ProcessAssign, ShotOverlay, FormsModule, NzSpinModule, NzFormModule, MailSelect, RichText, NzUploadModule, NzSelectModule, DictPipe, DiffTimePipe]
})
export class ProcessDetail implements OnInit {
    form: any = {
        id: '',
        name: '',
        config: '',
        children: []
    }
    taskList: any[] = [];
    backList: any[] = [];
    isBack: boolean = false; // 是否点击了退回按钮
    instanceId: string = '';
    dag: string = '';
    visible: boolean = false;
    modalLoading: boolean = false;
    @ViewChild("dagContainer", {read: DagContainer})
    dagContainer: DagContainer;
    @ViewChild("auditFormContainer", {read: DyForm})
    auditFormContainer: DyForm;
    @ViewChild("richText", {read: RichText})
    richText: RichText;

    pending: boolean | string = false;
    // 申请人信息
    starterInfo: any = {};
    // 当前任务
    currentTask: any = {}
    loading: boolean = false;

    emails: any[] = [];
    drawer: any = {
        visible: false,
        loading: false,
        attachments: [],
        data: {
            emails: '',  // 邮件抄送人str，逗号分隔
            remark: '',
            backwardTaskId: '', // 回退节点
            attachments: '' // 化为字符串后的附件
        }
    }
    canAudit: boolean = false; // 当前用户是否可以审批, true就表示可以，需要请求后端接口
    needAuditForm: boolean = false; // 当前用户是否需要填写额外的表单
    auditForm: any = {} // 审批单json(加载动态表单)
    taskHistoryForm: any = {
        visible: false,
        loading: false,
        form: null
    };
    // 全行用户清单
    userList: any[] = [];

    // 指派弹窗可见
    assignVisible: boolean = false;

    constructor(private processSvc: ProcessService,
                private route: ActivatedRoute,
                private message: NzMessageService,
                private notification: NzNotificationService,
                private userSvc: UserService,
                private uploadSvc: UploadService) {
    }

    ngOnInit(): void {
        this.userSvc.query({page: 1, size: 10000, deptName_oda: 1}).subscribe(res => this.userList = res.data.list);
        this.route.queryParams.subscribe(res => {
            if (res["id"]) {
                // 流程实例ID
                const id = res["id"];
                if (this.instanceId != id) { // 查看另外一个详情，需要全部重新渲染
                    this.emails = [];
                    this.taskList = [];
                    this.backList = [];
                    this.resetDrawerData();
                }
                this.instanceId = id;
                this.loading = true;
                // 查找申请人填写的表单，以及审批历史
                this.processSvc.findInstanceDetail(id).subscribe((result: any) => {
                    const data = result.data;
                    this.pending = data.status == 'RUNNING';
                    this.form = JSON.parse(data.formData);
                    // 回显邮件抄送
                    this.drawer.data.emails = data.emails;
                    if (data.emails != null) {
                        this.emails = data.emails.split(",");
                    } else {
                        this.emails = [];
                    }
                    this.dag = data.dag;
                    // 查找申请人信息
                    this.userSvc.queryBaseInfo(data.starter).subscribe((userInfo: any) => {
                        this.starterInfo = userInfo.data;
                    })
                    // 刷新时间轴
                    this.refreshTimeline();
                })
            }
        });
    }

    /**
     * 刷新时间轴
     */
    refreshTimeline() {
        this.processSvc.queryTaskAuditList(this.instanceId).subscribe(res => {
            this.appendTimelineNode(res.data);
        });
    }

    /**
     * 追加时间轴节点
     * @param taskList 任务清单数据
     * @private
     */
    private appendTimelineNode(taskList: any) {
        const backList = []; // 构造可退回清单
        for (let i = 0; i < taskList.length; i++) {
            const task = taskList[i];
            if (task.userNode) {
                backList.push(task);
            }
            if (task.attachments != null && task.attachments != '') {
                task.attachments = JSON.parse(task.attachments);
            } else {
                task.attachments = [];
            }
        }
        // 更新时间轴，追加时间轴节点
        // 因为"同意","拒绝","退回"操作会更新最后一个时间轴节点，并且还会产生后续节点，
        // 所以我们把最后一个节点删掉(数据太旧)，重新追加(append)
        if (taskList.length > 0 && this.taskList.length > 0) {
            this.taskList.splice(this.taskList.length - 1, 1);
        }
        if (backList.length > 0) {
            backList.splice(backList.length - 1, 1);
            if (this.backList.length > 0) { // 已渲染，追加
                // this.backList.splice(this.backList.length - 1, 1);
                backList.forEach(item => this.backList.push(item))
            } else { // 否则，设初始值
                this.backList = backList;
            }
        }
        taskList.forEach(item => this.taskList.push(item));
        // 当前任务节点
        this.currentTask = this.taskList[this.taskList.length - 1];
        if (this.currentTask.name == 'end') {
            // 结束了，不再显示pending
            this.pending = false;
        }
        // 是否有额外的审批表单
        this.createAuditForm();
        // 判断当前用户是否可以审批当前任务
        this.processSvc.judgePermission(this.currentTask.id).subscribe((res: any) => {
            const data = res.data;
            this.canAudit = data.canAudit;
            this.currentTask.users = data.users;
            this.currentTask.roles = data.roles;
            this.loading = false;
        });
    }


    /**
     * 缩小流程图
     */
    zoom(factor: number) {
        this.dagContainer.getGraph().zoom(factor)
    }

    /**
     * 查看流程图
     */
    viewGraph() {
        this.visible = true;
        this.modalLoading = true;
        // 再触发一次异步，重新渲染dag
        timer(0).subscribe(res => {
            this.modalLoading = false;
            const list = this.taskList;
            const nodeStatusList = [];
            for (let i = 0; i < list.length; i++) {
                const task = list[i]
                const nodeStatus = {id: task.dagNodeId, incomeId: task.incomeId, status: "default"}
                // 如果上一环节发生了退回操作，那么当前环节就是退回的目标，记录下来退回之前，走的是哪条路线，
                // 以便绘制退回路线（退回路线的源头就是发生退回操作的环节的入口）
                if (i > 0 && list[i - 1].status == "BACK") {
                    nodeStatus["backIncomeId"] = list[i - 1].incomeId;
                }
                // 0-无状态 1-待受理 2-已受理 3-已指派 4-已通过 5-被拒绝 6-被退回 7-失败
                switch (list[i].status) {
                    case "FAILED":
                    case "REJECTED":
                    case "BACK":
                        nodeStatus.status = "failed";
                        break;
                    case "SUCCESS":
                        nodeStatus.status = "success";
                        break;
                    case "RUNNING":
                    case "CLAIMED":
                    case "ASSIGNED":
                    case "PENDING":
                        nodeStatus.status = "running";
                        break;
                    case "NONE":
                    default:
                        nodeStatus.status = "default";
                }
                nodeStatusList.push(nodeStatus);
            }
            this.dagContainer.resetCells(JSON.parse(this.dag))
            // 查找审批历史，并且显示状态
            this.dagContainer.showNodeStatus(nodeStatusList);
        })
    }

    /**
     * 受理任务
     */
    claim() {
        this.loading = true;
        this.processSvc.claim(this.currentTask.id).pipe(switchMap((res: any) => {
            this.currentTask = res.data;
            this.taskList[this.taskList.length - 1] = this.currentTask;
            // 是否有额外的审批表单
            this.createAuditForm();
            return of(1);
        })).subscribe(res => {
            this.loading = false;
            this.notification.success("提示", "您已受理，现在您可以亲自审批或指派(需要有指派权限)给其他人来审批");
            this.currentTask.status = 'CLAIMED';
        })
    }

    /**
     * 渲染额外的审批表单
     * @private
     */
    private createAuditForm() {
        if (this.currentTask.formId != null && this.currentTask.formId != '') {
            // 加载form表单
            this.processSvc.findFormDefinition(this.currentTask.formId).subscribe((res: any) => {
                const definition = res.data.definition
                this.auditForm = JSON.parse(definition);
                this.needAuditForm = true;
            })
        } else {
            this.needAuditForm = false;
        }
    }

    openAssign() {
        this.assignVisible = true;
    }

    /**
     * 指派
     */
    assign($event: any) {
        const value = {...$event, taskId: this.currentTask.id}
        this.processSvc.assign(value).subscribe(res => {
            this.message.success("指派成功");
            this.assignVisible = false;
            this.currentTask = res.data;
            this.taskList[this.taskList.length - 1] = this.currentTask;
        })
    }

    openAudit() {
        this.drawer.visible = true;
    }

    /**
     * 上传附件
     * @param file
     * @param fileList
     */
    upload = (file, fileList) => {
        return this.uploadSvc.upload(file).pipe(mergeMap((res: any) => {
            const file = res["data"]
            this.drawer.attachments = [...this.drawer.attachments, file];
            return of(false);
        }))
    };

    /**
     * 同意审批
     */
    approve() {
        this.drawer.loading = true;
        if (this.needAuditForm) { // 需要填写审批单，那就要校验
            if (!this.auditFormContainer.validate()) {
                this.drawer.loading = false;
                return;
            } else {
                this.drawer.data.formData = this.auditForm;
            }
        }
        this.drawer.loading = true;
        this.handleDrawerData('APPROVE');
        this.processSvc.handleTask(this.drawer.data).pipe(catchError(err => {
            this.drawer.loading = false;
            return EMPTY;
        })).subscribe((res: any) => {
            this.message.success("操作成功");
            this.resetDrawerData();
            this.drawer.visible = false;
            this.drawer.loading = false;
            this.appendTimelineNode(res.data);
        });
    }

    /**
     * 退回
     */
    back() {
        if (!this.drawer.data.backwardTaskId) {
            this.message.error("请指定回退环节");
            return;
        }
        this.loading = true;
        this.drawer.loading = true;
        this.handleDrawerData('BACK');
        this.processSvc.handleTask(this.drawer.data).pipe(catchError(err => {
            this.drawer.loading = false;
            return EMPTY;
        })).subscribe((res: any) => {
            this.message.success("回退成功");
            this.resetDrawerData();
            this.drawer.visible = false;
            this.drawer.loading = false;
            this.cancelBack();
            this.appendTimelineNode(res.data);
        });
    }

    /**
     * 取消退回
     */
    cancelBack() {
        this.isBack = false;
        this.drawer.data.backwardTaskId = '';
    }

    openBack() {
        this.isBack = true;
        this.drawer.data.backwardTaskId = '';
    }

    /**
     * 拒绝
     */
    reject() {
        this.loading = true;
        this.drawer.loading = true;
        this.handleDrawerData('REJECT')
        this.processSvc.handleTask(this.drawer.data).pipe(catchError(err => {
            this.drawer.loading = false;
            return EMPTY;
        })).subscribe((res: any) => {
            this.message.success("操作成功");
            this.resetDrawerData();
            this.drawer.visible = false;
            this.drawer.loading = false;
            this.appendTimelineNode(res.data);
            this.pending = false;
        });
    }


    /**
     * 处理抽屉数据
     * @param operation 'APPROVE' | 'BACK' | 'REJECT'分别代表同意，退回，拒绝
     * @private
     */
    private handleDrawerData(operation: 'APPROVE' | 'BACK' | 'REJECT') {
        // 处理附件
        if (this.drawer.attachments != null && this.drawer.attachments.length > 0) {
            this.drawer.data.attachments = JSON.stringify(this.drawer.attachments);
        } else {
            this.drawer.data.attachments = "";
        }
        this.drawer.data.operation = operation;
        this.drawer.data.taskId = this.currentTask.id;
        // 富文本处理，主要是一些转换工作
        this.drawer.data.remark = this.richText.polish(this.drawer.data.remark);
        // 处理收件人数据
        if (this.emails == null) {
            this.drawer.data.emails = '';
        } else {
            this.drawer.data.emails = this.emails.join(",");
        }
    }

    /**
     * 重置抽屉视图的数据
     * @private
     */
    private resetDrawerData() {
        this.drawer.data.taskId = '';
        this.drawer.attachments = [];
        this.drawer.data.attachments = '';
        this.drawer.data.remark = '';
        this.drawer.data.formData = null;
    }

    /**
     * 查看审批表
     * @param formId
     */
    viewTaskHistoryForm(formId: any) {
        if (this.taskHistoryForm.visible) {
            this.taskHistoryForm.visible = false;
            return;
        }
        this.taskHistoryForm.loading = true;
        // 查找表单数据
        this.processSvc.findFormInstance(formId).subscribe(res => {
            this.taskHistoryForm.form = JSON.parse(res.data);
            this.taskHistoryForm.visible = true;
            this.taskHistoryForm.loading = false;
        })
    }

    downloadLog() {
        window.location.href = environment.SERVER_URL + "/api/process-instance/log?instanceId=" + this.instanceId + "&token="
            + localStorage.getItem("token");
    }
}
