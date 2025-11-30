import type { ContainerRendererProps } from "@/core/schema/types"

/**
 * 容器组件
 * @param node renderer传进来的节点数据
 * @param renderChildren 渲染子组件的函数
 * @returns 返回一个div，里面渲染子组件
 */
export default function Container({ node, renderChildren }: ContainerRendererProps) {
	return (
		<div className="relative">
			{renderChildren(node.children!)}
		</div>
	)
}