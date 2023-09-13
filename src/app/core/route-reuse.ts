import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";

export interface OnReuseRetrieve {
    onReuseRetrieve(): void;
}

/**
 * 路由复用策略
 */
export class RouteReuse implements RouteReuseStrategy {
    private handlers: { [key: string]: DetachedRouteHandle; } = {};
    private reused: boolean = false; // 防重复加载

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const key = this.getKey(route);
        if (key == null || key == '') {
            return null;
        }
        const handler = this.handlers[key] as any;
        if (this.reused) { // 防止重复调用
            // 如果组件实现了OnReuseRetrieve方法，直接调用
            if (handler.componentRef.instance.onReuseRetrieve) {
                handler.componentRef.instance.onReuseRetrieve();
            }
        }
        this.reused = true;
        return handler;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const key = this.getKey(route);
        if (key == null || key == '') {
            return false;
        }
        if (this.isReuse(route)) {
            return !!this.handlers[key];
        }
        return false;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (this.isReuse(route)) {
            // @ts-ignore
            return route.routeConfig.data.reuse;
        }
        return false;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        this.reused = false; // createNode函数触发
        return future.routeConfig === curr.routeConfig;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        if (handle) {
            const key = this.getKey(route);
            if (key != null && key != '') {
                this.handlers[key] = handle;
            }
        }
    }

    /**
     * 获取路由的path作为key
     * @param route
     */
    private getKey(route: ActivatedRouteSnapshot): string {
        if (!route.routeConfig) {
            return '';
        }
        return route.routeConfig.path as string;
    }

    /**
     * 判断是否是路由复用组件
     * @param route
     */
    private isReuse(route: ActivatedRouteSnapshot): boolean {
        if (route.routeConfig) {
            if (route.routeConfig.data) {
                return Boolean(route.routeConfig.data.reuse);
            }
        }
        return false;
    }

    public clear() {
        this.handlers = {};
    }
}
