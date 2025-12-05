import type { ButtonComponent } from "@/core/schema/basic";
import type { FieldMeta } from "./common";

// Button 组件 props 对应的元数据配置
export const buttonFieldMeta: Record<keyof ButtonComponent["props"], FieldMeta> = {
  text: {
    title: "按钮文本",
    placeholder: "请输入按钮内容",
  },
  type: {
    title: "按钮类型",
    enum: ["default", "primary", "dashed", "link", "text"],
    widget: "radio",
  },
  size: {
    title: "按钮尺寸",
    enum: ["small", "middle", "large"],
    widget: "radio",
  },
  danger: {
    title: "危险态",
    widget: "switch",
  },
  block: {
    title: "通栏展示",
    widget: "switch",
  },
  disabled: {
    title: "禁用",
    widget: "switch",
  },
};


