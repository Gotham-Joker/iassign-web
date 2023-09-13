import {APP_INITIALIZER, NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DictionaryService} from "./core/dictionary/dictionary.service";
import {StartupService} from "./core/startup.service";
import {NZ_I18N, zh_CN} from "ng-zorro-antd/i18n";
import {FormsModule} from "@angular/forms";
import {DictionaryModule} from "./core/dictionary/dictionary.module";
import {NzNotificationModule} from "ng-zorro-antd/notification";
import {LayoutModule} from "./pages/layout/layout.module";
import {Observable, zip} from "rxjs";
import {DefaultInterceptor} from "./core/default.interceptor";
import {registerLocaleData} from "@angular/common";
import zh from '@angular/common/locales/zh';
import {RichTextModule} from "./core/components/rich-text/rich-text.module";
import {IconsProviderModule} from "./core/ng-zorro/icons-provider.module";
import {SharedModule} from "./core/shared.module";
import {NZ_CONFIG, NzConfig} from "ng-zorro-antd/core/config";


// angular国际化
registerLocaleData(zh);

// 注册http拦截器
const DEFAULT_HTTP_INTERCEPTOR: Provider = {multi: true, provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor};

// 项目启动的时候去加载资源(菜单、用户基本信息等)
function initializeAppFactory(startupService: StartupService, dictionarySvc: DictionaryService): () => Observable<any> {
    return () => zip(startupService.load(), dictionarySvc.load());
}

const APP_INITIALIZE_PROVIDER: Provider = {
    multi: true,
    provide: APP_INITIALIZER,
    useFactory: initializeAppFactory,
    deps: [StartupService, DictionaryService]
}

// ng-zorro全局配置
const nzConfig: NzConfig = {
    notification: {
        // 因为应用顶部栏高度约为52px，所以nzNotification(通知横幅)距离顶部64px(默认是24px)
        nzTop: 64
    }
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        // 注册应用字典模块
        DictionaryModule,
        // 注册ng-zorro的通知模块
        NzNotificationModule,
        LayoutModule,
        RichTextModule,
        IconsProviderModule, // 系统图标
        SharedModule // 系统通用模块
    ],
    providers: [
        // ng-zorro国际化
        {provide: NZ_I18N, useValue: zh_CN},
        // nz-zorro全局个性化配置
        {provide: NZ_CONFIG, useValue: nzConfig},
        DEFAULT_HTTP_INTERCEPTOR,
        // 全局服务 单例
        StartupService,
        DictionaryService,
        APP_INITIALIZE_PROVIDER
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
