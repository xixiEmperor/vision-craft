import type React from "react";
import type { ComponentType } from "@/core/schema/types";
import type { ComponentNode } from "@/core/schema/basic";
import type { PageDSL } from "@/core/schema/page";
import Container from "./basic/Container";
import Text from "./basic/Text";
import Clock from "./basic/Clock";
import RootContainer from "./basic/RootContainer";
import BarChart from "./chart/BarChart";

/**
 * 组件注册表类
 * 用于注册已实现的组件
 * 使用Map()结构存储，查找时时间复杂度为O(1)，效率更高
 */
// 每个注册组件都约定接收 renderer 传入的节点数据和可选的 renderChildren 回调
type RegistryComponent = (props: {
  node: ComponentNode | PageDSL;
  renderChildren?: (children: ComponentNode[]) => React.ReactNode;
}) => React.ReactNode;

// 自定义 Map 类型，让 get 在类型层面**一定**返回一个可用于 JSX 的组件（避免 Renderer 中出现 undefined 报错）
interface ComponentRegistry
  extends Map<ComponentType | "error-callback" | "RootContainer", RegistryComponent> {
  get(key: ComponentType | "error-callback" | "RootContainer"): RegistryComponent;
}

/**
 * 组件注册表管理类
 * 提供组件的注册、获取、查询等静态方法
 */
class ComponentRegistryManager {
  private static readonly registry: ComponentRegistry = new Map();

  /**
   * 注册组件
   * @param type 组件类型
   * @param component 组件函数
   */
  static register(type: ComponentType | "error-callback" | "RootContainer", component: RegistryComponent): void {
    this.registry.set(type, component);
  }

  /**
   * 获取组件
   * @param type 组件类型
   * @returns 组件函数
   */
  static get(type: ComponentType | "error-callback" | "RootContainer"): RegistryComponent {
    return this.registry.get(type);
  }

  /**
   * 获取所有已注册的组件
   * @returns 包含所有组件的Map
   */
  static getAllComponents(): ComponentRegistry {
    return this.registry;
  }

  /**
   * 获取已注册组件的数量
   * @returns 组件数量
   */
  static size(): number {
    return this.registry.size;
  }
}

// 预注册基础组件，键为 Schema 中的 type 字段
// 这里通过类型断言把具体组件适配到统一的 RegistryComponent 约定
ComponentRegistryManager.register("Container", Container as unknown as RegistryComponent);
ComponentRegistryManager.register("Text", Text as unknown as RegistryComponent);
ComponentRegistryManager.register("Clock", Clock as unknown as RegistryComponent);
ComponentRegistryManager.register("BarChart", BarChart as unknown as RegistryComponent);
ComponentRegistryManager.register("RootContainer", RootContainer as unknown as RegistryComponent); // 根容器组件是一个特殊的容器组件

// 导出类实例和类型
export { ComponentRegistryManager };
export type { RegistryComponent, ComponentRegistry };

// 为了保持向后兼容，导出原有的 componentRegistry
export const componentRegistry: ComponentRegistry = ComponentRegistryManager.getAllComponents();