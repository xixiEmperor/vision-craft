import { 
    DndContext,
    type DragStartEvent
} from "@dnd-kit/core";

export default function DndWrapper({ children }: { children: React.ReactNode }) {

    const handleDragStart = (event: DragStartEvent) => {
        console.log('拖拽组件注册的数据', event)
    }

    return (
        <DndContext 
            onDragStart={ handleDragStart }
        >
            {children}
        </DndContext>
    );
}