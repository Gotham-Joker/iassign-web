import {inject, NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {Layout} from "./pages/layout/layout";
import {RouteReuse} from "./core/route-reuse";
import {ProcessDesign} from "./pages/routes/process/process-design/process-design";
import {FormDesign} from "./pages/routes/form/form-design/form-design";
import {RouteGuard} from "./core/route.guard";
import {RichText} from "./core/components/rich-text/rich-text";

const routes: Routes = [
    {path: '', redirectTo: '/process/process-list', pathMatch: 'full'},
    // 业务逻辑模块
    {
        path: '', component: Layout, children: [
            {
                path: 'process',
                loadChildren: () => import("./pages/routes/process/process.module").then(m => m.ProcessModule),
                data: {breadcrumb: '工作流'}
            },
            {
                path: 'form',
                loadChildren: () => import("./pages/routes/form/form-designer.module").then(m => m.FormDesignerModule),
                data: {breadcrumb: '表单'}
            },
            // 系统管理模块
            {
                path: 'system',
                loadChildren: () => import('./pages/layout/system/system.module').then(m => m.SystemModule),
                data: {breadcrumb: '系统设置'}
            },
            {
                path: 'account-setting',
                loadChildren: () => import('./pages/routes/user-profile/user-profile.module').then(m => m.UserProfileModule),
                data: {breadcrumb: '个人中心'}
            }
        ]
    },
    // 流程设计，全屏 需要权限才可以访问该页面
    {
        path: 'process-designer',
        component: ProcessDesign,
        canActivate: [() => inject(RouteGuard).canActive('process_design')]
    },
    // 表单设计，全屏 需要权限才可以访问该页面
    {
        path: 'form-designer', component: FormDesign,
        canActivate: [() => inject(RouteGuard).canActive('process_design')]
    },
    {path: 'rich', component: RichText},
    {path: 'passport', loadChildren: () => import('./pages/passport/passport.module').then(m => m.PassportModule)}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
    providers: [{provide: RouteReuseStrategy, useClass: RouteReuse}]
})
export class AppRoutingModule {
}
