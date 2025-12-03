import type { ContainerRendererProps } from "@/core/schema/types"
import DroppableItem from "@/core/dnd/DroppableItem"
import type { PageDSL } from "@/core/schema/page";
// import { nanoid } from "nanoid"  // 不再需要

/**
 * 根容器组件
 * @param node renderer传进来的节点数据
 * @param renderChildren 渲染子组件的函数
 * @returns 返回一个div，里面渲染子组件
 */
export default function RootContainer({ node, renderChildren }: ContainerRendererProps) {
	const pageNode = node as PageDSL;
	let className: string = `relative w-[${pageNode.settings.width}] h-[${pageNode.settings.height}]`


	return (
		<DroppableItem id={node.id}>
			<div className={className}>
				{renderChildren(node.children!)}
			</div>
		</DroppableItem>
	)
}