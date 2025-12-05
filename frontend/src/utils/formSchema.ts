import { componentMetaRegistry } from "@/config/meta/registry";
import type { ComponentType } from "@/core/schema/types";
import toJsonSchema from "to-json-schema";

/**
 * 通用的 props → Schema 生成函数
 * - 输入：组件类型 + 默认 props 模板
 * - 过程：to-json-schema 推断结构 + 根据 meta 注册表补充 UI / 校验信息
 * - 输出：form-render 可直接使用的 Schema
 */
export const getComponentPropsSchema = (
  type: ComponentType,
  propsTemplate: unknown,
) => {
  // 使用 to-json-schema 从默认配置中推导基础 JSON Schema
  const baseSchema = toJsonSchema(propsTemplate, {
    // 将当前对象中的所有 key 视为必填
    required: true,
  }) as any;

  const fieldMeta = componentMetaRegistry[type];

  // form-render 推荐使用对象 schema，顶层是一个 object
  if (baseSchema?.type === "object" && baseSchema.properties && fieldMeta) {
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
      const meta = fieldMeta[key];
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

      // 对于需要自定义/补充的复杂字段（如嵌套对象、数组），允许直接覆盖 schema
      if (meta.schema && typeof meta.schema === "object") {
        Object.assign(current, meta.schema);
      }
    });
  }

  // form-render 顶层 schema 可以指定 displayType 等全局 UI 配置
  if (!baseSchema.displayType) {
    baseSchema.displayType = "column";
  }

  return baseSchema;
};

