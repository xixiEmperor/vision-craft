import type { ContainerRendererProps } from "@/core/schema/types"
import DndWrapper from "@/core/dnd/DndWrapper"

/**
 * 容器组件
 * @param node renderer传进来的节点数据
 * @param renderChildren 渲染子组件的函数
 * @returns 返回一个div，里面渲染子组件
 */
export default function Container({ node, renderChildren }: ContainerRendererProps) {
	let className: string = ''
	// 根据不同类型的container应用不同的样式
	if (node.type === "Container") {
		className = `relative top-[${node.style?.y || 0}px] left-[${node.style?.x || 0}px] 
					w-[${node.style?.width || 300}px] h-[${node.style?.height || 300}px]` 
	}
	if (node.type === "RootContainer") {
		className = `relative w-[${node.settings.width + 'px' || 100}%] h-[${node.settings.height + 'px' || 100}%]`
	}

	return (
		<DndWrapper>
			<div className={className}>
				{renderChildren(node.children!)}
			</div>
		</DndWrapper>
	)
}