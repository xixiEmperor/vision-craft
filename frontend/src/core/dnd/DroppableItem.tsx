import { useDroppable } from "@dnd-kit/core";

interface DroppableItemProps {
    id: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export default function DroppableItem({ id, children, style }: DroppableItemProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const defaultStyle = isOver ? { backgroundColor: 'green', opacity: 0.7 } : {};
    const finalStyle = { ...defaultStyle, ...style };

    return (
        <div
            ref={setNodeRef}
            style={finalStyle}
            className="h-full"
        >
            {children}
        </div>
    );
}