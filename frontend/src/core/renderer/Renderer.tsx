import { componentRegistry } from "@/components/materials/registry"
import type { ComponentNode } from "../schema/basic"

/**
 * 渲染器，递归渲染组件树
 * @param schema 组件的schema
 */
export default function Renderer ({ schema }: { schema: ComponentNode | ComponentNode[] }): React.ReactNode {
	// 如果scheme是一个数组，说明传入了children，遍历children渲染
	if (Array.isArray(schema)) {
		return schema.map(node => <Renderer key={node.id} schema={node} />)
	}

	if (!schema.type || !schema) {
		return null
	}

	// 在组件注册表中查找对应类型的组件
	const renderComponent = componentRegistry.get(schema.type) || componentRegistry.get("error-callback")

  // 这里的 renderChildren 是为了让容器组件能够回调引擎来渲染它的子节点
  // 实现了 "控制反转"，容器不需要知道子节点具体是什么类型
	const renderChildren = (children: ComponentNode[]) => <Renderer schema={children} />

	// 通过注册表中取出的渲染函数来渲染当前节点
	return renderComponent({
		node: schema,
		renderChildren
	})
}