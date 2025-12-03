import { 
    DndContext,
    type DragStartEvent,
    type DragEndEvent
} from "@dnd-kit/core";
import { useSchemaStore } from "@/store/schema-store";
import { getNewComponentConfig } from "@/config";
import { nanoid } from "nanoid";

/**
 * 该组件是一个拖拽的上下文环境，统一封装各种事件处理逻辑
 */

export default function DndWrapper({ children }: { children: React.ReactNode }) {
    const schemaStore = useSchemaStore();

    // 拖拽开始事件处理
    const handleDragStart = (event: DragStartEvent) => {
        // TODO: 需要新增组件config，拖拽开始时，深拷贝一份拖拽组件对应config，在useDraggable中注册数据
        // 目前仅做调试输出，真正的实例 id 在拖拽结束时统一生成，保证「每次成功拖拽一个新实例就得到一个全新的 id」
        console.log("拖拽开始", event.active.id);
    }

    // 拖拽结束事件处理
    const handleDragEnd = (event: DragEndEvent) => {
        // TODO: 拖拽结束时，更新组件树结构，更新组件config
        console.log('拖拽结束', event)
        const dropItemId = event.over?.id;
        if (!dropItemId) return;

        // 根据拖拽源的 id 获取对应组件的基础配置（类型信息等）
        const newConfig = getNewComponentConfig(event.active.id as any);
        // 这里为「实际落下的组件实例」生成一个全新的 id，
        // 不依赖 DraggableItem 中的状态，保证每一次成功拖拽得到的实例 id 都唯一
        newConfig.id = nanoid();
        schemaStore.addItem(dropItemId.toString(), newConfig);
    }

    return (
        <DndContext 
            onDragStart={ handleDragStart }
            onDragEnd={ handleDragEnd }
        >
            {children}
        </DndContext>
    );
}