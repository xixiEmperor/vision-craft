import type { BaseComponentNode } from "./types";

/**
 * 文字组件
 */
export interface TextComponent extends BaseComponentNode {
	type: 'Text';
	props: {
		content: string; // 内容
		fontSize: number; // 字体大小
		fontWeight: number; // 字体粗细
		color: string; // 颜色
		textAlign: 'left' | 'center' | 'right'; // 对齐方式
	};
}

/**
 * 时钟组件
 */
export interface ClockComponent extends BaseComponentNode {
  type: 'Clock';
  props: {
    format: string; // 时间格式，例如：HH:mm:ss
    fontSize: number; // 字体大小
    fontWeight: number; // 字体粗细
    color: string; // 颜色
    textAlign: 'left' | 'center' | 'right'; // 对齐方式
    showSeconds?: boolean; // 是否显示秒
  };
}

/**
 * 容器组件
 * 核心：拥有 children 属性
 */
export interface ContainerComponent extends BaseComponentNode {
  type: 'Container';
  props?: {
    layoutMode: 'absolute' | 'flex'; // 布局模式：自由拖拽 vs 自动排列
    gap?: number;                    // flex 模式下的间距
  };
  // 核心关系定义：递归结构
  children?: ComponentNode[]; 
}

// 所有可能的组件类型集合
export type ComponentNode = 
	| TextComponent
  | ClockComponent
  | ContainerComponent;

