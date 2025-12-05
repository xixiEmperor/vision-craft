declare module "to-json-schema" {
  /**
   * to-json-schema 运行时配置的简化类型定义
   * 这里只声明了当前项目用到的字段，避免 TS 报错
   */
  export interface ToJsonSchemaOptions {
    required?: boolean | string[];
  }

  export default function toJsonSchema(
    input: unknown,
    options?: ToJsonSchemaOptions,
  ): any;
}


