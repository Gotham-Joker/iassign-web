import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StartupService, UserInfo} from "../../../core/startup.service";
import {mergeMap, of} from "rxjs";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.scss'],
    standalone: true,
    imports: [NzCardModule, NzTabsModule, NzUploadModule, NzButtonModule, NzWaveModule, NzIconModule, NzDividerModule, NzDescriptionsModule]
})
export class UserProfile implements OnInit {
    passwdForm: FormGroup;
    userInfo: UserInfo;
    upload = (file, fileList) => {
        return this.startupSvc.uploadAvatar(file).pipe(mergeMap((res: any) => {
            this.startupSvc.userInfo.avatar = res["data"];
            return of(false);
        }))
    };


    constructor(private fb: FormBuilder, private startupSvc: StartupService) {
    }

    ngOnInit(): void {
        this.userInfo = this.startupSvc.userInfo;
        this.passwdForm = this.fb.group({
            'rawPasswd': ['', [Validators.required]],
            'newPasswd': ['', [Validators.required, Validators.minLength(6)]],
            'confirmPasswd': ['', [Validators.required, Validators.minLength(6)]]
        })
    }

}
