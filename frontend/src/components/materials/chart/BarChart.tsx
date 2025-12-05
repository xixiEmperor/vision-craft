import { useMemo } from "react";
import * as echarts from "echarts";
import type { RendererProps } from "@/core/schema/types";
import type { BarChartComponent } from "@/core/schema/chart";
import EChartsBase from "./EChartsBase";

/**
 * BarChart 业务组件
 * - 从节点 props 中读取配置与数据
 * - 负责将 DSL 转换成 ECharts 所需的 option
 */
export default function BarChart({ node }: RendererProps) {
  const chartNode = node as BarChartComponent;
  const { props } = chartNode;

  // 统一处理数据源为普通数组，便于后续扩展 API 数据
  const data = (props.dataSource?.data ?? []) as Record<string, any>[];

  // 根据 DSL 配置生成 ECharts 配置项
  const option = useMemo(() => {
    const xData = data.map((item) => item[props.xAxisField]);
    const yData = data.map((item) => item[props.yAxisField]);

    return {
      // 标题配置，默认放在图表上方中间
      title: {
        text: props.title,
        top: 0,
      },
      // 悬浮提示配置
      tooltip: {
        show: props.tooltipEnabled,
        trigger: "axis",
      },
      // 网格区域配置：通过明确的上下左右边距，减少图表与容器四周的空白
      grid: {
        top: 40,    // 距离容器顶部留出标题区域
        right: 10,  // 右侧留出极少量空白
        bottom: 10, // 底部为类目轴标签预留空间
        left: 10,   // 左侧为数值轴刻度预留空间
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xData,
      },
      yAxis: {
        type: "value",
        // 通过 showGrid 控制是否显示背景网格线，而不是控制 grid 是否存在
        splitLine: {
          show: props.showGrid,
        },
      },
      legend: {
        show: props.showLegend,
      },
      series: [
        {
          type: "bar",
          data: yData,
          itemStyle: {
            color: props.barColor || "#5470c6",
          },
        },
      ],
    } as echarts.EChartsOption;
  }, [data, props]);

  return <EChartsBase option={option} />;
}


