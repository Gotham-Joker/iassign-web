import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StartupService, UserInfo} from "../../../core/startup.service";
import {mergeMap, of} from "rxjs";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.html',
    styleUrls: ['./user-profile.scss']
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
