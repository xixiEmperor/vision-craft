import { Rnd } from "react-rnd";
import type React from "react";
import type { ComponentNode } from "@/core/schema/basic";
import { useSchemaStore } from "@/store/schema-store";
import { useShallow } from "zustand/shallow";

interface RndItemProps {
  // 当前渲染的节点数据
  node: ComponentNode;
  // 真实业务组件（文本、容器等）
  children: React.ReactNode;
}

/**
 * 基于 react-rnd 的可拖拽 / 可缩放包装组件
 * - 负责把 schema 中的 style 同步到画布上的绝对定位
 * - 在拖拽 / 缩放结束时把最新的位置和尺寸回写到 schema-store
 * - 同时承载「选中态」的点击事件与高亮 UI
 */
export default function RndItem({ node, children }: RndItemProps) {
  const { updateItem, removeItem, selectedId, setSelectedId } = useSchemaStore(
    useShallow((state) => ({
      updateItem: state.updateItem,
      removeItem: state.removeItem,
      selectedId: state.selectedId,
      setSelectedId: state.setSelectedId,
    })),
  );

  // 兜底的样式，防御 style 为空的情况，避免 Rnd 报错
  const style = node.style ?? {
    top: 0,
    left: 0,
    width: 200,
    height: 50,
    zIndex: 1,
  };

  const isSelected = selectedId === node.id;

  return (
    <Rnd
      // 初始尺寸和位置均来源于 schema 中的 style
      size={{ width: style.width, height: style.height }}
      position={{ x: style.left, y: style.top }}
      // 限制拖拽边界在父容器内部
      bounds="parent"
      // 锁定时禁止拖拽和缩放
      disableDragging={Boolean(node.isLocked)}
      enableResizing={!node.isLocked}
      style={{
        zIndex: style.zIndex,
      }}
      // 拖拽结束时同步最新坐标
      onDragStop={(_e, data) => {
        const nextStyle = {
          ...style,
          left: data.x,
          top: data.y,
        };
        // 更新节点的 style，保持其他业务字段不变
        updateItem(node.id, { style: nextStyle } as Partial<ComponentNode>);
      }}
      // 缩放结束时同步最新尺寸与坐标
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        const nextStyle = {
          ...style,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          left: position.x,
          top: position.y,
        };
        // 更新节点的 style，保持其他业务字段不变
        updateItem(node.id, { style: nextStyle } as Partial<ComponentNode>);
      }}
    >
      {/* 内层容器负责点击选中、高亮边框和标签区域 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: style.backgroundColor,
        }}
        onClick={(event) => {
          // 阻止冒泡，避免触发父级容器的点击
          event.stopPropagation();
          setSelectedId(node.id);
        }}
      >
        {/* 选中态外框：四边全包围的高亮边框 */}
        {isSelected && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1px solid #1677ff",
              boxShadow: "0 0 0 1px rgba(22,119,255,0.3)",
              borderRadius: 2,
              pointerEvents: "none",
            }}
          />
        )}

        {isSelected && (
          <>
            {/* 左上角名称标签：提示当前组件名称 */}
            <div
              style={{
                position: "absolute",
                top: -18,
                left: 0,
                padding: "0 6px",
                height: 16,
                lineHeight: "16px",
                fontSize: 12,
                backgroundColor: "#1677ff",
                color: "#ffffff",
                borderRadius: 2,
                whiteSpace: "nowrap",
              }}
            >
              {/* 标签文案优先使用自定义名称，其次回落到组件类型 */}
              {node.name || node.type}
            </div>

            {/* 右上角操作标签区域：删除 / 取消选中 */}
            <div
              style={{
                position: "absolute",
                top: -18,
                right: 0,
                display: "flex",
                gap: 4,
              }}
            >
              <div
                style={{
                  padding: "0 6px",
                  height: 16,
                  lineHeight: "16px",
                  fontSize: 12,
                  backgroundColor: "#ff4d4f",
                  color: "#ffffff",
                  borderRadius: 2,
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={(event) => {
                  // 阻止冒泡，避免点击操作标签时触发重新选中
                  event.stopPropagation();
                  removeItem(node.id);
                  // 如果当前被删除的就是选中组件，则重置选中状态
                  if (isSelected) {
                    setSelectedId(null);
                  }
                }}
              >
                删除
              </div>

              <div
                style={{
                  padding: "0 6px",
                  height: 16,
                  lineHeight: "16px",
                  fontSize: 12,
                  backgroundColor: "rgba(0,0,0,0.65)",
                  color: "#ffffff",
                  borderRadius: 2,
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={(event) => {
                  // 阻止冒泡，避免点击操作标签时触发重新选中
                  event.stopPropagation();
                  // 取消当前元素的选中状态
                  setSelectedId(null);
                }}
              >
                取消
              </div>
            </div>
          </>
        )}
        {children}
      </div>
    </Rnd>
  );
}


