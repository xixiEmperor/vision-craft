import type React from "react"
import { AlignJustify, Box, Clock3, Image, MousePointerClick } from "lucide-react"
import DraggableItem from "@/core/dnd/DraggableItem"

interface ComponentItem {
    type: string,
    name: string,
    icon: React.ReactNode
}

function PanelItem({ type, name, icon }: ComponentItem) {
    return (
        <DraggableItem id={ type }>
            <div className="w-[110px] h-[110px] flex flex-col items-center justify-evenly 
                            border border-gray-300 rounded-[5px] cursor-grab">
                <div>
                    {icon}
                </div>
                <p>
                    {name}
                </p>
            </div>
        </DraggableItem>
    )
}

export default function BasicPanel() {
    const component: ComponentItem[] = [
        {
            type: "Text",
            name: "文字组件",
            icon: <AlignJustify />
        },
        {
            type: "Image",
            name: "图片组件",
            icon: <Image />
        },
        {
            type: "Button",
            name: "按钮组件",
            icon: <MousePointerClick />
        },
        {
            type: "Clock",
            name: "时钟组件",
            icon: <Clock3 />
        },
        {
            type: "Container",
            name: "容器组件",
            icon: <Box />
        }
    ]

    return (
        <div className="w-[265px] grid grid-cols-2 grid-rows-component gap-[15px] p-[15px]">
            {
                component.map(item => (
                    <PanelItem 
                        key={item.type} 
                        {...item}
                    />
                ))
            }
        </div>
    )
}