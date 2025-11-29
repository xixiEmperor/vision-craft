/**
 * @file 此文件专门用于定义图表组件的Schema
 */
import type { BaseChartComponent } from "./types";

/**
 * 柱状图组件
 */
export interface BarChartComponent extends BaseChartComponent {
	type: 'BarChart';
}