/*
 * MIT License
 *
 * Copyright (c) 2024 Hongtao Liu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { AppComponent } from './app/app.component';
import { SharedModule } from './app/core/shared.module';
import { IconsProviderModule } from './app/core/ng-zorro/icons-provider.module';
import { LayoutModule } from './app/pages/layout/layout.module';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { DefaultInterceptor } from './app/core/default.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { DictionaryService } from './app/core/dictionary/dictionary.service';
import { StartupService } from './app/core/startup.service';
import { Provider, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import {registerLocaleData} from "@angular/common";
import zh from "@angular/common/locales/zh";

registerLocaleData(zh)

const nzConfig: NzConfig = {
    notification: {
        // 因为应用顶部栏高度约为52px，所以nzNotification(通知横幅)距离顶部64px(默认是24px)
        nzTop: 64
    }
}
const DEFAULT_HTTP_INTERCEPTOR: Provider = {multi: true, provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor};
const APP_INITIALIZE_PROVIDER: Provider = {
    multi: true,
    provide: APP_INITIALIZER,
    useFactory: initializeAppFactory,
    deps: [StartupService, DictionaryService]
}
function initializeAppFactory(startupService: StartupService, dictionarySvc: DictionaryService): () => Observable<any> {
    return () => zip(startupService.load(), dictionarySvc.load());
}




bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule, 
        // 注册ng-zorro的通知模块
        NzNotificationModule, LayoutModule, IconsProviderModule, SharedModule // 系统通用模块
        ),
        // ng-zorro国际化
        { provide: NZ_I18N, useValue: zh_CN },
        // nz-zorro全局个性化配置
        { provide: NZ_CONFIG, useValue: nzConfig },
        DEFAULT_HTTP_INTERCEPTOR,
        // 全局服务 单例
        StartupService,
        DictionaryService,
        APP_INITIALIZE_PROVIDER,
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
