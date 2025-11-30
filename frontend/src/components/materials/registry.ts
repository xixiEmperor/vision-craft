import type React from "react";
import type { ComponentType } from "@/core/schema/types";
import type { ComponentNode } from "@/core/schema/basic";
import Container from "./basic/container";

/**
 * 组件注册表
 * 用于注册已实现的组件
 * 使用Map()结构存储，查找时时间复杂度为O(1)，效率更高
 */
// 每个注册组件都约定接收 renderer 传入的节点数据和可选的 renderChildren 回调
type RegistryComponent = (props: {
  node: ComponentNode;
  renderChildren?: (children: ComponentNode[]) => React.ReactNode;
}) => React.ReactNode;

// 自定义 Map 类型，让 get 在类型层面**一定**返回一个可用于 JSX 的组件（避免 Renderer 中出现 undefined 报错）
interface ComponentRegistry
  extends Map<ComponentType | "error-callback", RegistryComponent> {
  get(key: ComponentType | "error-callback"): RegistryComponent;
}

// 全局组件注册表
export const componentRegistry: ComponentRegistry = new Map();

// 预注册基础容器组件，键为 Schema 中的 type 字段
// 这里通过类型断言把具体组件适配到统一的 RegistryComponent 约定
componentRegistry.set(
  "Container",
  Container as unknown as RegistryComponent,
);