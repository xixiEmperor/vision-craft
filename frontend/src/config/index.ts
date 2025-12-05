import { textDefaultConfig } from "./text.config";
import { containerDefaultConfig } from "./container.config";
import { clockDefaultConfig } from "./clock.config";
import { barChartDefaultConfig } from "./bar-chart.config";
import { smartDeepClone } from "@/utils/deepClone";
import type { ComponentNode } from "@/core/schema/basic";

/**
 * 组件默认配置映射
 * - key 对应 Schema 中的组件类型 type
 * - value 为组件的默认 DSL 配置
 */
export const componentDefaultConfigs = {
  Text: textDefaultConfig,
  Container: containerDefaultConfig,
  Clock: clockDefaultConfig,
  BarChart: barChartDefaultConfig,
};

export const getNewComponentConfig = (type: keyof typeof componentDefaultConfigs): ComponentNode => {
 // 根据type 获取对应的默认配置
  return smartDeepClone(componentDefaultConfigs[type]);
}


