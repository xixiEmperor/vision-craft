import { 
    DndContext,
    DragOverlay,
    type DragStartEvent,
    type DragEndEvent
} from "@dnd-kit/core";
import { useState } from "react";
import { useSchemaStore } from "@/store/schema-store";
import { getNewComponentConfig } from "@/config";
import { nanoid } from "nanoid";

/**
 * 该组件是一个拖拽的上下文环境，统一封装各种事件处理逻辑
 */

export default function DndWrapper({ children }: { children: React.ReactNode }) {
    const schemaStore = useSchemaStore();
    // 记录当前处于拖拽中的元素 id，用于在 DragOverlay 中渲染预览内容
    const [activeId, setActiveId] = useState<string | null>(null);

    // 拖拽开始事件处理
    const handleDragStart = (event: DragStartEvent) => {
        // TODO: 需要新增组件config，拖拽开始时，深拷贝一份拖拽组件对应config，在useDraggable中注册数据
        // 目前仅做调试输出，真正的实例 id 在拖拽结束时统一生成，保证「每次成功拖拽一个新实例就得到一个全新的 id」
        setActiveId(event.active.id as string);
    }

    // 拖拽结束事件处理
    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        // 拖拽结束时，更新组件树结构，更新组件的默认位置配置
        const dropItemId = event.over?.id;
        if (!dropItemId) return;

        // 根据拖拽源的 id 获取对应组件的基础配置（类型信息等）
        const newConfig = getNewComponentConfig(event.active.id as any);

        // ===== 计算新组件在父容器中的实际落点坐标 =====
        // 利用 dnd-kit 提供的 rect 信息：
        // - active.rect.current.translated：拖拽结束时，拖拽源在视口中的最终位置
        // - over.rect：当前命中的可放置区域在视口中的位置
        // 通过两者相减，得到组件在父容器内部的相对 left / top
        const activeRect = event.active.rect.current?.translated;
        const overRect = event.over?.rect;

        if (activeRect && overRect) {
            const offsetLeft = activeRect.left - overRect.left;
            const offsetTop = activeRect.top - overRect.top;

            // 防御性代码：确保 style 对象存在
            const nextStyle: any = newConfig.style ?? {};
            nextStyle.left = offsetLeft;
            nextStyle.top = offsetTop;
            newConfig.style = nextStyle;
        }

        // 这里为「实际落下的组件实例」生成一个全新的 id，
        // 不依赖 DraggableItem 中的状态，保证每一次成功拖拽得到的实例 id 都唯一
        newConfig.id = nanoid();
        schemaStore.addItem(dropItemId.toString(), newConfig);
    }

    // 拖拽被取消（例如 ESC 或拖拽到无效区域）时重置状态
    const handleDragCancel = () => {
        setActiveId(null);
    }

    return (
        <DndContext 
            onDragStart={ handleDragStart }
            onDragEnd={ handleDragEnd }
            onDragCancel={ handleDragCancel }
        >
            {children}
            {/* 全局拖拽浮层，保证拖拽预览始终在画布上层显示 */}
            <DragOverlay>
                {activeId && (
                    <div
                        style={{
                            zIndex: 9999,
                            pointerEvents: "none",
                        }}
                    >
                        {/* TODO: 此处可根据 activeId 渲染对应组件的真实预览内容 */}
                        {activeId}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}