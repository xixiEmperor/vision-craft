import SidebarMenu from "@/panels/component-panel/SidebarMenu"
import DndWrapper from "@/core/dnd/DndWrapper"
import DroppableItem from "@/core/dnd/DroppableItem"
import Renderer from "@/core/renderer/Renderer"
import EmptyTemplate from "../EmptyTemplate"
import { useSchemaStore } from "@/store/schema-store"
import { useShallow } from "zustand/shallow"

export default function Index() {
  const { schema } = useSchemaStore(useShallow((state) => ({
    schema: state.schema
  })))

  return (
    <>
      {!schema && <EmptyTemplate />}
      {schema &&
        <div className="grid grid-cols-custom grid-rows-header h-[100vh]">
            <div className="row-start-1 row-end-2 col-start-1 col-end-4 border border-red-500">
              此处应为头部工具栏
            </div>
            <DndWrapper>
              <SidebarMenu className="border border-blue-500" />
              <DroppableItem id={schema.id}>
                <Renderer schema={schema} />
              </DroppableItem>
            </DndWrapper>
            <div className="border border-yellow-500">
              此处应为右侧属性面板
            </div>
          </div>
        }
    </>
  )
}