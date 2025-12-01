## 实现组件拖拽与 JSON 状态管理方案

### 整体目标

- **从左侧组件库拖拽到画布**：使用 dnd-kit，将组件库中的模板项作为拖拽源，画布作为 droppable 区域，`onDragEnd` 时向全局 schema 中新增一个组件实例。
- **画布内拖拽 / 缩放**：使用 react-rnd，以每个 schema 节点为中心，实现拖拽和尺寸调整，并把结果写回 JSON schema。
- **全局 JSON schema 管理**：使用 nanoid 生成组件实例 id，结合 zustand 将页面组件树统一管理在一个全局 store 中，renderer 只负责根据 schema 递归渲染。

### 相关文件

- schema & 渲染器：
- [`frontend/src/core/schema/types.ts`](frontend/src/core/schema/types.ts)（已有 `BaseComponentNode` / `ComponentType` 等）
- [`frontend/src/core/schema/basic.ts`](frontend/src/core/schema/basic.ts)（包含 `ComponentNode` / 容器类型，计划在此集中定义默认节点工厂）
- [`frontend/src/core/renderer/Renderer.tsx`](frontend/src/core/renderer/Renderer.tsx)（现有递归 renderer，将在此接入 react-rnd 包装）
- 组件注册与组件库：
- [`frontend/src/components/materials/registry.ts`](frontend/src/components/materials/registry.ts)（组件注册表）
- [`frontend/src/panels/component-panel/BasicPanel.tsx`](frontend/src/panels/component-panel/BasicPanel.tsx)（基础组件列表，将改造为 dnd 源）
- [`frontend/src/panels/component-panel/SidebarMenu.tsx`](frontend/src/panels/component-panel/SidebarMenu.tsx)（如果有分类切换，这里会作为容器接入 dnd 上下文）
- 编辑器外壳与画布：
- [`frontend/src/components/editor/Index.tsx`](frontend/src/components/editor/Index.tsx)（已有 `DndContext`，将完善为完整的 dnd 容器 + 画布渲染）
- 全局状态：
- 新增 [`frontend/src/store/editorStore.ts`](frontend/src/store/editorStore.ts)（使用 zustand 存放页面 schema 与编辑动作）

### 步骤 1：完善 schema 定义与默认节点工厂

1. **在 `basic.ts` 中集中定义/补充节点类型与工厂方法**：

- 定义 `ComponentNode` 联合类型（如 `TextComponent`, `ContainerComponent`, 图表组件等），确保都扩展 `BaseComponentNode`。
- 新增一个工厂方法，例如 `createNodeByType(type: ComponentType, overrides?: Partial<ComponentNode>): ComponentNode`。

2. **在工厂方法中使用 nanoid 生成实例 id**：

- 使用 `nanoid()` 生成 `BaseComponentNode.id`，确保页面内唯一。
- 根据类型设置合理的 `style` 默认值（`x`, `y`, `width`, `height`, `zIndex`）和组件 `props` 默认值（如 Text 默认文案、字体大小等）。

3. **保持 schema 与 renderer 的契合**：

- 确保工厂创建出的节点 `type` 与 `ComponentType`、以及 `componentRegistry` 中注册的 key 一致（如 "Text"、"Container"）。

### 步骤 2：创建 editor zustand store 管理 JSON schema

1. 在 [`frontend/src/store/editorStore.ts`](frontend/src/store/editorStore.ts) 中：

- 使用 `zustand` 创建 `useEditorStore`：
 - `pageSchema: ComponentNode[]`（当前页面根级组件列表）。
 - 可选 `selectedId?: string` 等编辑相关状态（为后续扩展预留）。
- 定义编辑动作：
 - `addComponentFromPalette(type: ComponentType, position?: { x: number; y: number }): void`：内部调用 `createNodeByType` 并 push 到 `pageSchema`（可根据 position 填充 `style.x/y`）。
 - `updateNodeStyle(id: string, partial: Partial<ComponentNode['style']>): void`：在 react-rnd 拖拽/缩放结束时更新 `x/y/width/height/zIndex` 等。
 - 可选：`bringToFront(id: string)` 等后续功能。

2. 采用 **全局单一 schema 源**：

- 编辑器和 renderer 都只读/写 `useEditorStore`，不再各自维护 schema 的局部 state。

### 步骤 3：接入 dnd-kit：组件库 → 画布 的拖拽

1. **在 `BasicPanel.tsx` 中将组件项改造为 dnd 源**：

- 使用 `@dnd-kit/core` 的 `useDraggable` 钩子，为每个 `PanelItem` 绑定：
 - `id` 可以使用前缀 + 类型，如 `"palette-Text"`，保证在 dnd 层面唯一即可。
 - 通过 `data` 传入组件类型（例如 `data: { type: 'Text' }`），便于在 canvas drop 时识别。
- 为面板项添加 `listeners` 和 `attributes` 到根节点，并在拖拽时用 `transform` 渲染跟随效果（可选）。

2. **在 `Index.tsx` 中配置 dnd 上下文与画布 droppable**：

- 保留 `DndContext`，增加 `onDragEnd` 回调：
 - 从 `event.active.data.current` 取出 `type`，从 `event.over?.id` 判断是否落在画布区域。
 - 当 `over?.id === 'canvas'` 时，调用 `useEditorStore.getState().addComponentFromPalette(type, position)` 向 schema 中添加节点。
- 使用 `useDroppable` 在画布 div 上注册 droppable：`id: 'canvas'`。
- 初期 position 可以简单使用一个默认点（例如 `(100,100)`），后续再根据鼠标坐标优化落点计算。

### 步骤 4：让画布根据 store 中的 JSON schema 渲染

1. 在 `Index.tsx` 的画布区域中：

- 使用 `const schema = useEditorStore((s) => s.pageSchema)` 订阅当前页面 schema。
- 将原来的占位文案替换为 `<Renderer schema={schema} />`。

2. 保持 renderer 的职责单一：

- `Renderer` 仍然只通过传入的 schema 递归选择具体组件，不感知 zustand 和 dnd，仅作为“渲染引擎”。

### 步骤 5：在 Renderer 中用 react-rnd 实现画布内拖拽

1. 引入 `react-rnd` 并设计一个通用包装组件：

- 在 [`frontend/src/core/renderer/Renderer.tsx`](frontend/src/core/renderer/Renderer.tsx) 中新增一个内部组件，例如 `CanvasNodeWrapper`：
 - 接收 `node: ComponentNode` 和 `children`。
 - 从 `node.style` 中读取 `x/y/width/height` 作为 `Rnd` 的 `position` 与 `size`。
 - 在 `onDragStop` / `onResizeStop` 回调中，调用 `useEditorStore.getState().updateNodeStyle(node.id, { x, y, width, height })` 将结果写回 schema。

2. 将渲染逻辑调整为“先包装再渲染具体组件”：

- `Renderer` 中查表拿到组件渲染函数 `renderComponent` 后，不再直接返回该组件，而是：
 - 外层用 `CanvasNodeWrapper`（即 `Rnd`）包裹，内层再渲染真正的业务组件：`renderComponent({ node: schema, renderChildren })`。
- 对于容器组件，`renderChildren` 依旧通过 `Renderer` 递归渲染子节点，每个子节点同样由 `CanvasNodeWrapper` 管理自己的拖拽与尺寸。

3. 保证样式融合：

- 在 `Rnd` 渲染的根元素上合并 schema 中的 `style` 与组件自身的视觉样式（颜色、边框等），避免覆盖。

### 步骤 6：ID 使用与一致性策略

1. **组件实例 id（JSON 层）**：

- 始终由工厂函数通过 `nanoid()` 生成，存入 `BaseComponentNode.id`，并作为：
 - React `key`。
 - react-rnd 更新位置/大小时的查找 key。
 - 后续图层面板、选中状态等的唯一标识。

2. **dnd-kit 的 draggable / droppable id**：

- 组件库项使用固定的 palette id（如 `palette-Text`），只表达“模板来源”，与实例 id 解耦。
- 画布 droppable 使用固定 id（如 `'canvas'`），后续如果支持容器内直接拖放，可为容器再注册各自的 droppable id，并在 `onDragEnd` 中根据 `over.id` 决定 parent 节点。

### 步骤 7：依赖与后续扩展

1. **依赖检查与安装**：

- 确认 `zustand`、`react-rnd` 已写入 `frontend/package.json` 依赖；如未安装，则通过包管理器安装。

2. **后续可扩展方向（非本次必须实现）**：

- 在 store 中加入撤销/重做栈（历史记录），便于回退操作。
- 在拖拽中增加对齐线 / 吸附网格，对齐到画布或其他组件边缘。
- 增加图层面板，基于 `pageSchema` 顺序和 `zIndex` 展示、管理组件层级。