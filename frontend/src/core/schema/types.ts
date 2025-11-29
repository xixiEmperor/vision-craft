/**
 * 组件Schema定义
 */
export interface ComponentSchema {
	id: string;
	type: 'basic' | 'chart' | 'layout' | 'decoration';
	name: string;
}