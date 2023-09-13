import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-backward',
    templateUrl: './backward.html',
    styles: [`.backward-text {
      color: black
    }

    .backward-text:hover {
      color: rgb(24, 144, 255);
    }

    .backward-btn {
      border: 1px solid #efefef;
      color: rgb(24, 144, 255);
    }

    .backward-btn:hover {
      box-shadow: 0 10px 12px -8px rgba(0, 0, 0, .2);
    }
    `]
})
export class Backward implements OnInit {
    // 用浏览器默认的返回行为
    @Input()
    isBack: boolean = true;
    @Input()
    backText: string = "返回上一页";

    @Output()
    onBack: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit(): void {
    }

    backward() {
        if (this.isBack) {
            history.back();
        } else {
            this.onBack.emit('');
        }
    }
}
