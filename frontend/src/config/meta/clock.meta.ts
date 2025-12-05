import type { ClockComponent } from "@/core/schema/basic";
import type { FieldMeta } from "./common";

// Clock 组件 props 对应的元数据配置，用于驱动 XRender form-render 的表单渲染
export const clockFieldMeta: Record<keyof ClockComponent["props"], FieldMeta> = {
  format: {
    title: "时间格式",
    placeholder: "例如：HH:mm:ss",
  },
  fontSize: {
    title: "字体大小",
    minimum: 12,
    maximum: 72,
    widget: "inputNumber",
  },
  fontWeight: {
    title: "字体粗细",
    enum: [300, 400, 500, 600, 700],
  },
  color: {
    title: "文字颜色",
    placeholder: "例如：#000000",
  },
  textAlign: {
    title: "对齐方式",
    enum: ["left", "center", "right"],
    widget: "radio",
  },
  showSeconds: {
    title: "显示秒",
    widget: "switch",
  },
};


