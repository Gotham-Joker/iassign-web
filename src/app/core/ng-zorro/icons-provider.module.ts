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

import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {IconDefinition} from '@ant-design/icons-angular';

import {
    FormOutline,
    DashboardOutline,
    LoadingOutline,
    UserOutline,
    LockOutline,
    TeamOutline,
    SearchOutline,
    LogoutOutline,
    MoreOutline,
    UserAddOutline,
    UserDeleteOutline,
    FileSearchOutline,
    CrownOutline,
    SyncOutline,
    BackwardOutline,
    MailOutline,
    CalendarOutline,
    ArrowDownOutline,
    ArrowUpOutline,
    RedEnvelopeOutline,
    UploadOutline,
    PaperClipOutline,
    PhoneOutline,
    IdcardOutline,
    InfoCircleOutline,
    MonitorOutline,
    AlignCenterOutline,
    ZoomInOutline,
    ZoomOutOutline,
    RedoOutline,
    UndoOutline,
    ColumnWidthOutline,
    GroupOutline,
    SettingOutline,
    GatewayOutline,
    DeleteOutline,
    OneToOneOutline,
    NodeIndexOutline,
    PartitionOutline,
    ForwardOutline,
    CopyOutline,
    SendOutline,
    CheckOutline,
    RollbackOutline
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [
    DashboardOutline, LoadingOutline,
    FormOutline, UserOutline, LockOutline, TeamOutline, SearchOutline,
    LogoutOutline, MoreOutline, UserAddOutline, UserDeleteOutline, FileSearchOutline,
    CrownOutline, SyncOutline, BackwardOutline, MailOutline,
    CalendarOutline, ArrowDownOutline, ArrowUpOutline, RedEnvelopeOutline,
    UploadOutline, PaperClipOutline, PhoneOutline, IdcardOutline,
    InfoCircleOutline, MonitorOutline, AlignCenterOutline, ZoomInOutline, ZoomOutOutline, RedoOutline,
    UndoOutline, ColumnWidthOutline, GroupOutline, SettingOutline, GatewayOutline, DeleteOutline, OneToOneOutline,
    NodeIndexOutline, PartitionOutline, ForwardOutline, CopyOutline, SendOutline, CheckOutline, RollbackOutline
];

/**
 * NG-ZORRO官方的图标模块(当前模块是全局静态引入的，为了避免打包臃肿，请按需import网站需要的图标，不建议全部引入)
 */
@NgModule({
    imports: [NzIconModule.forChild(icons)],
    exports: [NzIconModule]
})
export class IconsProviderModule {
}
