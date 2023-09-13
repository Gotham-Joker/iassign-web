import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

/**
 * 客户排名列表
 */
@Component({
    selector: 'app-badge',
    templateUrl: './badge.html',
    styleUrls: ['./badge.scss']
})
export class Badge implements OnInit {

    /**
     * 是否是增长
     */
    @Input()
    riseUp: boolean = false;

    @Input()
    desc: string;

    constructor() {
    }

    ngOnInit(): void {
    }


}
