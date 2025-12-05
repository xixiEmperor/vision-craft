import type { ImageComponent } from "@/core/schema/basic";
import type { FieldMeta } from "./common";

// Image 组件 props 对应的元数据配置
export const imageFieldMeta: Record<keyof ImageComponent["props"], FieldMeta> = {
  src: {
    title: "图片地址",
    placeholder: "请输入图片链接",
  },
  alt: {
    title: "备用文本",
    placeholder: "加载失败时的提示",
  },
  fit: {
    title: "填充方式",
    enum: ["fill", "contain", "cover", "none", "scale-down"],
    widget: "select",
  },
  preview: {
    title: "启用预览",
    widget: "switch",
  },
};


