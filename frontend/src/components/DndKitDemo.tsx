import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent, 
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier
} from '@dnd-kit/core';
import { nanoid } from 'nanoid';

// --- 1. Draggable Component ---
interface DraggableItemProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
}

function DraggableItem({ id, children }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  
  // 应用拖动时的偏移样式
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-item"
    >
      {children}
    </div>
  );
}

// --- 2. Droppable Component ---
interface DroppableContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
}

function DroppableContainer({ id, children }: DroppableContainerProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  
  // 当元素拖到上方时，改变背景颜色
  const style = {
    backgroundColor: isOver ? 'lightblue' : '#eee',
    borderColor: isOver ? 'blue' : '#ccc',
  };

  return (
    <div ref={setNodeRef} style={style} className="droppable-container">
      {children}
    </div>
  );
}


// --- 3. Main Application Component (Event Handlers) ---
export default function DndEventDemo() {
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);

  /**
   * 🌟 事件处理函数 1: onDragStart
   * 在拖动开始时触发。
   * * @param event DragStartEvent 包含当前拖动的 Draggable 的信息。
   */
  const handleDragStart = (event: DragStartEvent) => {
    console.log('--- Drag Start ---');
    // console.log('拖动开始元素 :', event.active);
    const id = nanoid()
    console.log('生成的id :', id)
    // 可以在这里记录哪个元素开始拖动，或执行拖动前的预处理
  };

  /**
   * 🌟 事件处理函数 2: onDragOver
   * 在拖动元素悬停在 Droppable 容器上方时触发。
   * * @param event DragOverEvent 包含 active (拖动元素) 和 over (下方容器) 的信息。
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    console.log('--- Drag Over ---');
    console.log('当前拖动元素 ID:', active.id);
    console.log('悬停目标容器 ID:', over ? over.id : '无');

    // 如果拖动元素在 Droppable 上方，我们可以更新它的父容器状态
    if (over) {
      // 这里的逻辑常用于实现自动排序或将元素放入新容器
    }
  };

  /**
   * 🌟 事件处理函数 3: onDragEnd
   * 在拖动操作结束（鼠标松开或取消）时触发。
   * * @param event DragEndEvent 包含 active (拖动元素) 和 over (最终目标容器) 的信息。
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('--- Drag End ---');
    console.log('拖动结束元素 ID:', active.id);
    console.log('最终放置目标 ID:', over ? over.id : '未放置到任何目标');
    
    // 如果最终有放置目标，更新元素的状态（例如，更新其父容器）
    if (over) {
        setParent(over.id);
        console.log(`✅ 元素 ${active.id} 已被放置到 ${over.id}`);
    } else {
        console.log('❌ 元素未放置到任何有效目标');
    }
  };
  
  // 判断 Draggable 应该出现在哪个 Droppable 中
  const isItemInContainerA = parent === 'droppable-a';
  const isItemInContainerB = parent === 'droppable-b';
  const isItemOutside = parent === null;


  return (
    <DndContext
      onDragStart={handleDragStart} // 🌟 拖动开始
      onDragOver={handleDragOver}   // 🌟 拖动悬停
      onDragEnd={handleDragEnd}     // 🌟 拖动结束
    >
      <h2>dnd-kit 事件处理 Demo</h2>
      <p>请打开浏览器的 **控制台 (Console)** 查看事件的触发和参数。</p>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* 初始位置：不在任何 Droppable 中 */}
        <div style={{ padding: '10px', border: '1px dashed #999', flex: 1, minHeight: '100px' }}>
            <h3>原始区域</h3>
            {(isItemOutside || isItemInContainerA) && (
                <DraggableItem id="draggable-item-1">
                    拖我! (ID: draggable-item-1)
                </DraggableItem>
            )}
        </div>
        
        {/* Droppable 容器 A */}
        <DroppableContainer id="droppable-a">
          <h3>容器 A (ID: droppable-a)</h3>
          {isItemInContainerA && (
             <DraggableItem id="draggable-item-1">
                拖我! (ID: draggable-item-1)
            </DraggableItem>
          )}
        </DroppableContainer>

        {/* Droppable 容器 B */}
        <DroppableContainer id="droppable-b">
          <h3>容器 B (ID: droppable-b)</h3>
          {isItemInContainerB && (
             <DraggableItem id="draggable-item-1">
                拖我! (ID: draggable-item-1)
            </DraggableItem>
          )}
        </DroppableContainer>
        
      </div>
      
      {/* 用于在组件树上挂载可拖动元素（如 DndContext 内部的 Portals 效果） */}
      {/* <DragOverlay>
        {activeId ? (
          <div className="draggable-item is-dragging">
            正在拖动...
          </div>
        ) : null}
      </DragOverlay> */}
      
    </DndContext>
  );
}

// --- 4. 示例样式 (CSS) ---

/**
 * ⚠️ 注意: 您需要将以下 CSS 添加到您的项目中，才能看到正确的布局和拖动效果。
 */
const demoStyles = `
.draggable-item {
  padding: 10px;
  background-color: #f63;
  color: white;
  border-radius: 5px;
  cursor: grab;
  margin-bottom: 10px;
  width: fit-content;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.droppable-container {
  flex: 1;
  min-height: 200px;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: background-color 0.2s, border-color 0.2s;
}

.droppable-container h3 {
  margin-top: 0;
  color: #555;
}
`;
<style>{demoStyles}</style>
