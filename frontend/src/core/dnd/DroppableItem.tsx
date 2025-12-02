import { useDroppable } from "@dnd-kit/core";

interface DroppableItemProps {
    id: string;
    children: React.ReactNode;
}

export default function DroppableItem({ id, children }: DroppableItemProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const style = isOver ? { backgroundColor: 'green', opacity: 0.7 } : {};

    return (
        <div
            ref={setNodeRef}
            style={style}
        >
            {children}
        </div>
    );
}