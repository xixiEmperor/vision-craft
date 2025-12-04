import { textDefaultConfig } from "@/config/text.config";
import type { TextComponent } from "@/core/schema/basic";
import toJsonSchema from "to-json-schema";

/**
 * 字段级元数据配置，用于在 to-json-schema 的基础上做轻量增强，
 * 最终产物要符合 form-render 的 Schema 结构（参考官网文档 https://xrender.fun/form-render）。
 */
interface FieldMeta {
  title?: string;
  description?: string;
  enum?: Array<string | number>;
  widget?: string;
  placeholder?: string;
  minimum?: number;
  maximum?: number;
}

// Text 组件 props 的元数据定义，用于补充枚举、标题等信息
const textFieldMeta: Record<keyof TextComponent["props"], FieldMeta> = {
  content: {
    title: "文本内容",
    placeholder: "请输入文本内容",
    widget: "textarea",
  },
  fontSize: {
    title: "字体大小",
    minimum: 12,
    maximum: 72,
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
};

/**
 * 基于 Text 组件默认配置，生成 props 对应的 JSON Schema（form-render 兼容版）
 * - 使用 to-json-schema 自动推断字段类型和结构
 * - 再根据元数据补充 title / enum / widget / placeholder / min / max 等信息
 */
export const getTextPropsSchema = () => {
  // 使用 to-json-schema 从默认配置中推导基础 JSON Schema
  const baseSchema = toJsonSchema(textDefaultConfig.props, {
    // 将当前对象中的所有 key 视为必填
    required: true,
  }) as any;

  // form-render 推荐使用对象 schema，顶层是一个 object
  if (baseSchema?.type === "object" && baseSchema.properties) {
    // to-json-schema 会在根上生成 required: string[]
    // 这里把它下沉到各个字段上，让 form-render 正确识别必填
    if (Array.isArray(baseSchema.required)) {
      baseSchema.required.forEach((requiredKey: string) => {
        const field = baseSchema.properties[requiredKey] as any;
        if (field && typeof field === "object") {
          field.required = true;
        }
      });
    }

    Object.entries(baseSchema.properties).forEach(([key, propSchema]) => {
      const meta = textFieldMeta[key as keyof typeof textFieldMeta];
      if (!meta) return;

      const current = propSchema as any;

      // 文本标题、描述
      if (meta.title) {
        current.title = meta.title;
      }
      if (meta.description) {
        current.description = meta.description;
      }

      // 枚举 & 取值范围（注意 form-render 用 min/max，而不是 minimum/maximum）
      if (meta.enum) {
        current.enum = meta.enum;
      }
      if (typeof meta.minimum === "number") {
        current.min = meta.minimum;
      }
      if (typeof meta.maximum === "number") {
        current.max = meta.maximum;
      }

      // UI 相关：widget + placeholder
      if (meta.widget) {
        current.widget = meta.widget;
      }
      if (meta.placeholder) {
        current.placeholder = meta.placeholder;
      }
    });
  }

  // form-render 顶层 schema 可以指定 displayType 等全局 UI 配置
  if (!baseSchema.displayType) {
    baseSchema.displayType = "column";
  }

  return baseSchema;
};

