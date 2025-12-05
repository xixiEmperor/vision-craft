import type { ComponentNode, ContainerComponent } from "./basic";
import type { PageDSL } from "./page";

// 组件类型枚举
export type ComponentType = 
  | 'Text' 
  | 'Image' 
  | 'Button'
  | 'Container' 
  | 'Clock'
  | 'BarChart' 
  | 'LineChart' 
  | 'PieChart';

/**
 * 基础组件节点接口
 * 所有的具体组件都继承自这个接口
 */
export interface BaseComponentNode {
  // 核心标识
  id: string;           // UUID，组件在当前页面的唯一标识
  type: ComponentType;  // 组件类型枚举，用于渲染器决定渲染哪个 React 组件
  name?: string;       // 组件在图层面板显示的名称 (如: "我的柱状图")
  isHidden?: boolean;   // 是否隐藏
  isLocked?: boolean;   // 是否锁定（防误触）

  // 样式属性 (CSS + 布局)
  style?: {
    // 基础定位与尺寸 (大屏强依赖绝对定位)
    top: number; // 左偏移
    left: number; // 上偏移
    width: number; // 宽度
    height: number; // 高度
    zIndex: number; // 层级
    
    // 视觉样式
    opacity?: number; // 透明度
    backgroundColor?: string; // 背景颜色
    border?: string; // 边框样式
    borderRadius?: number; // 圆角
    // ... 其他 CSS 属性
    [key: string]: any;
  };
  
  // 交互事件 (可选，进阶功能)
  // events?: {
  //   onClick?: Action[]; // 点击时触发的动作（如：跳转链接、弹窗）
  // };
}

/**
 * 通用图表数据源配置
 */
interface ChartDataSource {
  sourceType: 'static' | 'api'; // 数据来源：静态JSON 或 API接口
  data: unknown[];                  // 静态数据
  apiUrl?: string;              // API 地址
  refreshInterval?: number;     // 自动刷新间隔
}

/**
 * 基础图表配置
 */
export interface BaseChartComponent extends BaseComponentNode {
  type: 'BarChart' | 'LineChart' | 'PieChart';
  props: {
    // 1. 数据配置
    dataSource?: ChartDataSource;
    xAxisField: string; // 指定数据中哪个字段是 X 轴 (如 "month")
    yAxisField: string; // 指定数据中哪个字段是 Y 轴 (如 "sales")

    // 2. 视觉配置 (映射到 ECharts option)
    title: string;
    barColor?: string;
    showGrid: boolean;
    showLegend: boolean;
    tooltipEnabled: boolean;
  };
}

/**
 * renderer对所有组件传入的props类型
 */
export interface RendererProps {
  node: ComponentNode | PageDSL;
}

/**
 * renderer对容器组件传入的props类型
 */
export interface ContainerRendererProps extends RendererProps {
  node: ContainerComponent | PageDSL;
  renderChildren: (children: ComponentNode[]) => React.ReactNode;
}
