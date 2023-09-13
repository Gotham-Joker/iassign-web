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
