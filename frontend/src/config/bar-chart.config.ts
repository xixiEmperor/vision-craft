import type { BarChartComponent } from "@/core/schema/chart";

/**
 * BarChart 组件默认配置
 * - 用于拖拽创建时初始化一个可用的柱状图示例
 */
export const barChartDefaultConfig: BarChartComponent = {
  id: "",
  type: "BarChart",
  name: "柱状图",
  props: {
    // 图表标题
    title: "示例柱状图",
    // X 轴字段名（对应 data 数组中的 key）
    xAxisField: "name",
    // Y 轴字段名（对应 data 数组中的 key）
    yAxisField: "value",
    // 是否展示背景网格
    showGrid: true,
    // 是否展示图例
    showLegend: false,
    // 是否开启 tooltip
    tooltipEnabled: true,
    // 可选柱子颜色，留空则使用 ECharts 默认调色板
    barColor: "#5470c6",
    // 默认静态示例数据，拖拽后即可看到效果
    dataSource: {
      sourceType: "static",
      data: [
        { name: "A", value: 120 },
        { name: "B", value: 200 },
        { name: "C", value: 150 },
      ],
    },
  },
  style: {
    // 初始位置与尺寸，后续可通过画布拖拽 / 缩放调整
    top: 0,
    left: 0,
    width: 400,
    height: 300,
    zIndex: 1,
  },
};


