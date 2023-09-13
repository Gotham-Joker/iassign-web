import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {StartupService} from "../startup.service";

/**
 * 权限访问控制
 * 用例: <button *acl="'api_upload'">提交</button>
 * 那么只有当前用户是管理员或者拥有api_upload权限才显示这个按钮
 * ACL: 即访问控制列表Access Control List
 */
@Directive({
    selector: '[acl]'
})
export class AclDirective {

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private startupSvc: StartupService) {
    }

    @Input('acl')
    set condition(condition: string[] | string) {
        if (this.startupSvc.userInfo.admin) { // 超级管理员拥有一切权限
            this.viewContainer.createEmbeddedView(this.templateRef);
            return;
        }
        const permissions = this.startupSvc.permissions as string[];
        if (Array.isArray(condition)) {
            for (let i = 0; i < condition.length; i++) {
                const permission = condition[i];
                if (!permissions.includes(permission)) {
                    this.viewContainer.clear();
                    return;
                }
            }
        } else {
            if (!permissions.includes(condition)) {
                this.viewContainer.clear();
                return;
            }
        }
        this.viewContainer.createEmbeddedView(this.templateRef);
    }

}
