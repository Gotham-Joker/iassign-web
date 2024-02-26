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

import {NgModule} from '@angular/core';
import {DagDesigner} from "./components/dag-designer/dag-designer";
import {DagContainer} from "./components/dag-container/dag-container";
import {EndNode} from "./components/nodes/end-node/end-node";
import {UserTaskNode} from "./components/nodes/user-task-node/user-task-node";
import {StartNode} from "./components/nodes/start-node/start-node";
import {SystemNode} from "./components/nodes/system-node/system-node";
import {GatewayNode} from "./components/nodes/gateway-node/gateway-node";
import {NodePanel} from "./components/node-panel/node-panel";
import {Toolbar} from "./components/toolbar/toolbar";
import {DagCommonModule} from "./dag-common.module";
import {FormsModule} from "@angular/forms";

// 当前模块需要引用其他公共模块(form表单,ng-zorro第三方组件库,图标等)
const MODULES = [DagCommonModule, FormsModule];
// 当前模块的组件
const COMPONENTS = [
  DagDesigner,
  Toolbar,
  DagContainer,
  UserTaskNode,
  NodePanel,
  GatewayNode,
  SystemNode,
  StartNode,
  EndNode
];


@NgModule({
    imports: [
        ...MODULES,
        ...COMPONENTS
    ],
    providers: [],
    exports: [...COMPONENTS]
})
export class DagModule {
}
