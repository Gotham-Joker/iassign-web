import {
    Component,
    ElementRef, EventEmitter,
    Input, OnChanges,
    OnInit, Output, SimpleChanges,
    ViewChild
} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Subject, timer} from "rxjs";
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NgFor, NgIf } from '@angular/common';
import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';

export interface MailSelectOption {
    avatar?: string,
    username: string,
    deptName?: string,
    email: string
}

@Component({
    selector: 'app-mail-select',
    templateUrl: 'mail-select.html',
    styleUrls: ['./mail-search.scss'],
    animations: [
        trigger('optionAnimation', [
            state('optionLeaving', style({ opacity: 0, display: 'none' })),
            // 创建一个状态名为hidden，用于动画结束时直接隐藏元素。
            transition('optionEntering => optionLeaving', [
                animate('.3s ease-out', style({ opacity: 0 }))
            ]),
            transition('optionLeaving => optionEntering', [
                style({ display: 'block', opacity: 1 })
            ])
        ])
    ],
    standalone: true,
    imports: [CdkOverlayOrigin, NgFor, NzAvatarModule, NzInputModule, FormsModule, CdkConnectedOverlay, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, NgIf, NzEmptyModule]
})

export class MailSelect implements OnInit, OnChanges {
    @ViewChild('origin', {read: ElementRef, static: true})
    elementRef: ElementRef;
    width: number;

    isShow: boolean = false;

    // 下拉选项，同时也与模糊搜索有关
    options: MailSelectOption[] = [];
    // 全部的清单
    @Input()
    list: MailSelectOption[] = [];

    // 已选中的item值，双向绑定
    @Input()
    emails: any[] = [];
    // 值变更通知
    @Output()
    emailsChange: EventEmitter<any> = new EventEmitter<any>();

    // 已选中的item
    value: MailSelectOption[] = [];
    keyword: any;
    minHeight: any = '0px';
    maxHeight: any = '0px';
    listSize: number = 10;


    constructor() {
    }

    ngOnInit() {
    }

    /**
     * 显示或隐藏下拉框
     */
    toggle() {
        if (!this.isShow) {
            this.width = this.elementRef.nativeElement.offsetWidth;
        }
        this.isShow = !this.isShow;
    }

    /**
     * 判断下拉框的数据是否被选中
     * @param val
     */
    isChecked(val) {
        return this.emails.includes(val);
    }

    /**
     * 移除邮件接收人
     * @param item
     */
    remove(item) {
        const index = this.emails.indexOf(item.email);
        this.emails.splice(index, 1);
        this.value.splice(index, 1);
        this.emailsChange.emit(this.emails);
    }

    /**
     * 添加邮件接收人
     * @param item
     */
    add(item) {
        this.value.push(item);
        this.emails.push(item.email);
        this.emailsChange.emit(this.emails);
    }

    /**
     * 模糊搜索用户输入变更检测
     */
    keywordChange() {
        if (this.keyword != null) {
            this.isShow = true;
            this.search();
        }
    }

    /**
     * 模糊搜索
     */
    search() {
        const option = [];
        this.list.forEach(item => {
            if (item.username.includes(this.keyword) || item.email.includes(this.keyword)) {
                if (item.email != null && /^\w+@[0-9a-zA-Z.]+/.test(item.email)) {
                    // 过滤没有邮箱地址或邮箱地址不正确的人员
                    option.push(item);
                }
            }
        })
        this.options = option;
        this.evaluateHeight();
    }

    /**
     * 计算下拉框的高度
     * @private
     */
    private evaluateHeight() {
        if (this.options.length == 0) {
            this.minHeight = '280px';
            return;
        }
        if (this.options.length < this.listSize) {
            this.minHeight = 40 * this.options.length + 'px';
        } else if (this.options.length >= this.listSize) {
            this.minHeight = 40 * this.listSize + 'px';
            this.maxHeight = 40 * this.listSize + 'px';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (!changes['list']?.firstChange) {
            this.value = [];
            // 初始状态下，下拉框显示所有数据，并判断哪些需要选中
            this.keyword = '';
            const option = [];
            this.list.forEach(item => {
                if (item.email != null && /^\w+@[0-9a-zA-Z.]+/.test(item.email)) {
                    // 过滤没有邮箱地址或邮箱地址不正确的人员
                    option.push(item);
                    if (this.emails.includes(item.email)) {
                        this.value.push(item);
                    }
                }
            })
            this.options = option;
            this.evaluateHeight();
        // }
    }

}