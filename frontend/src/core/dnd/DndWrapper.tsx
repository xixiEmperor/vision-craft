import { 
    DndContext,
    type DragStartEvent,
    type DragEndEvent
} from "@dnd-kit/core";
import { useTreeOperation } from "@/hooks/useTreeOperation";
import { useSchemaStore } from "@/store/schema-store";

/**
 * 该组件是一个拖拽的上下文环境，统一封装各种事件处理逻辑
 */

export default function DndWrapper({ children }: { children: React.ReactNode }) {
    const schemaStore = useSchemaStore();
    const { findItem } = useTreeOperation();

    // 拖拽开始事件处理
    const handleDragStart = (event: DragStartEvent) => {
        // TODO: 需要新增组件config，拖拽开始时，深拷贝一份拖拽组件对应config，在useDraggable中注册数据
        console.log('拖拽组件注册的数据', event.active.data.current?.newId)
    }

    // 拖拽结束事件处理
    const handleDragEnd = (event: DragEndEvent) => {
        // TODO: 拖拽结束时，更新组件树结构，更新组件config
        console.log('拖拽结束', event)
        const dropItemId = event.over?.id
        const target = findItem(dropItemId!.toString(), schemaStore.schema!)
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