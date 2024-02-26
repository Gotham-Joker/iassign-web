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
