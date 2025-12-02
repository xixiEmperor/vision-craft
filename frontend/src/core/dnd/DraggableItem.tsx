import { useDraggable } from "@dnd-kit/core";
import { nanoid } from "nanoid";

interface DraggableItemProps {
    id: string;
    children: React.ReactNode;
}

export default function DraggableItem({ id, children }: DraggableItemProps) {
    const newId = nanoid()
    const { listeners, attributes, setNodeRef, transform } = useDraggable({ 
        id,
        data: {
            newId
        }
    });
    

    // 应用拖动时的偏移样式
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div 
            ref={ setNodeRef }
            style={ style }
            { ...attributes }
            { ...listeners }
        >
            { children }
        </div>
    );
}