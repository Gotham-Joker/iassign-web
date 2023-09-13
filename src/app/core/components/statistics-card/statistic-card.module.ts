import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StatisticsCard} from "./statistics-card";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {BadgeModule} from "../badge/badge.module";

@NgModule({
    declarations: [StatisticsCard],
    imports: [
        CommonModule,
        NzToolTipModule,
        NzGridModule,
        NzCardModule,
        BadgeModule
    ],
    exports: [
        StatisticsCard
    ]
})
export class StatisticCardModule {

}