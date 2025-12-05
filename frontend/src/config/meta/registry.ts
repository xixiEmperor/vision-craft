import type { ComponentType } from "@/core/schema/types";
import type { FieldMeta } from "./common";
import { textFieldMeta } from "./text.meta";
import { clockFieldMeta } from "./clock.meta";
import { barChartFieldMeta } from "./bar-chart.meta";
import { imageFieldMeta } from "./image.meta";
import { buttonFieldMeta } from "./button.meta";

/**
 * 组件级元数据注册表
 * - key: 组件类型（Schema 中的 type）
 * - value: 对应组件 props 各字段的 FieldMeta 描述
 */
type ComponentMetaRegistry = Partial<
  Record<ComponentType, Record<string, FieldMeta>>
>;

export const componentMetaRegistry: ComponentMetaRegistry = {
  Text: textFieldMeta,
  Image: imageFieldMeta,
  Button: buttonFieldMeta,
  Clock: clockFieldMeta,
  BarChart: barChartFieldMeta,
};


