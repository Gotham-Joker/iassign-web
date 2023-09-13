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
  declarations: [...COMPONENTS],
  imports: [
    ...MODULES
  ],
  providers: [],
  exports: [...COMPONENTS]
})
export class DagModule {
}
