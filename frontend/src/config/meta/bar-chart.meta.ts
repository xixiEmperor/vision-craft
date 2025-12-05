import type { BarChartComponent } from "@/core/schema/chart";
import type { FieldMeta } from "./common";

/**
 * BarChart 组件 props 对应的元数据配置
 * - 用于驱动属性面板中 form-render 的表单渲染
 */
export const barChartFieldMeta: Record<
  keyof BarChartComponent["props"],
  FieldMeta
> = {
  title: {
    title: "图表标题",
    placeholder: "请输入图表标题",
  },
  xAxisField: {
    title: "X 轴字段名",
    description: "对应数据源中用于作为 X 轴的字段，例如 name",
    placeholder: "如：name",
  },
  yAxisField: {
    title: "Y 轴字段名",
    description: "对应数据源中用于作为 Y 轴值的字段，例如 value",
    placeholder: "如：value",
  },
  barColor: {
    title: "柱子颜色",
    placeholder: "例如：#5470c6",
  },
  showGrid: {
    title: "显示网格",
    widget: "switch",
  },
  showLegend: {
    title: "显示图例",
    widget: "switch",
  },
  tooltipEnabled: {
    title: "启用提示框",
    widget: "switch",
  },
  dataSource: {
    title: "数据源配置",
    schema: {
      type: "object",
      properties: {
        sourceType: {
          title: "数据源类型",
          enum: ["static", "api"],
          widget: "select",
        },
        data: {
          title: "静态数据",
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                title: "名称",
                type: "string",
                placeholder: "如：分类A",
              },
              value: {
                title: "数值",
                type: "number",
                widget: "inputNumber",
              },
            },
            required: ["name", "value"],
          },
        },
        apiUrl: {
          title: "接口地址",
          type: "string",
          placeholder: "https://api.example.com/data",
        },
        refreshInterval: {
          title: "刷新间隔(秒)",
          type: "number",
          minimum: 0,
        },
      },
    },
  },
};


