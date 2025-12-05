/**
 * 通用字段元数据类型定义
 * 用于描述 form-render 字段的 UI 与校验信息
 */
export interface FieldMeta {
  title?: string;
  description?: string;
  enum?: Array<string | number>;
  widget?: string;
  placeholder?: string;
  minimum?: number;
  maximum?: number;
}