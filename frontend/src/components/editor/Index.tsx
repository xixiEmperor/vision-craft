import SidebarMenu from "@/panels/component-panel/SidebarMenu"
import { DndContext } from "@dnd-kit/core"

export default function Index() {
  return (
    <div className="grid grid-cols-custom grid-rows-header h-[100vh]">
      <div className="row-start-1 row-end-2 col-start-1 col-end-4 border border-red-500">
        此处应为头部工具栏
      </div>
      <DndContext>
        <SidebarMenu className="border border-blue-500"/>
        <div className="border border-green-500">
          此处应为组件放置的画布区域
        </div>
      </DndContext>
      <div className="border border-yellow-500">
        此处应为右侧属性面板
      </div>
    </div>
  )
}