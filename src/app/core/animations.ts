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

import {animate, animateChild, group, query, state, style, transition, trigger} from "@angular/animations";

/**
 *  转场动画： zoom-fade-leave 放大淡出的方式离开
 *  在转场期间，新视图将直接插入在旧视图后面，并且这两个元素会同时出现在屏幕上。要防止这种行为，
 *  就要修改宿主视图，改用相对定位
 */
export const zoomFadeAnimation = trigger('routeAnimations', [
        transition('void => *', [style({transform: 'translateX(-100%)'}), animate('0.2s ease-in')]), // 进场
        transition('* => void', []), // 离场
        transition('* <=> *', [
            style({position: 'relative'}),
            group([
                query(':enter, :leave', [style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })], {optional: true}),
                query(':enter', [style({
                    opacity: '0',
                    transform: 'scale(0.98)'
                })], {optional: true})
            ]),
            group([
                query(':leave', [animate('.35s ease-in-out', style({opacity: '0'}))], {optional: true}),
                query(':leave', [animate('.28s ease-in-out', style({transform: 'scale(1.02)'}))], {optional: true}),
                query(':enter', [animate('.35s 0.36s ease-in-out', style({opacity: '1'}))], {optional: true}),
                query(':enter', [animate('.28s 0.36s ease-in-out', style({transform: 'scale(1)'}))], {optional: true})
            ])
        ])
    ]
);
