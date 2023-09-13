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
