import type { PageDSL } from "@/core/schema/page"
import type { ComponentNode } from "@/core/schema/basic"

/**
 * useTreeOperation
 * @description 组件树结构增删改查操作
 * @returns 
 */
export const useTreeOperation = () => {
    /**
     * 查找组件树中的某个组件
     * @param id 组件id
     * @param componentNode 组件树节点
     * @returns 
     */
    const findItem = (id: string, componentNode: ComponentNode | PageDSL): ComponentNode | PageDSL | null => {
        // 如果该节点为空，直接返回null
        if (componentNode === null) {
            return null
        }
        // 如果目标id与当前节点id相同，说明找到了，返回该节点
        if (id === componentNode.id) {
            return componentNode
        }
        // 如果没有找到且当前节点不为空，则查看是否有孩子(即是否是container)
        // 若有孩子，则遍历所有孩子
        if (componentNode.type === 'Container') {
            for (let node of componentNode.children!) {
                const found = findItem(id, node)
                if (found) {
                    return found
                }
            }
        }
        return null
    }


    /**
     * 组件树添加某个组件
     * @param componentNode 新增组件节点
     * @returns 
     */
    const addItem = (componentNode: ComponentNode) => {
        
    }

    return {
        findItem
    }
}