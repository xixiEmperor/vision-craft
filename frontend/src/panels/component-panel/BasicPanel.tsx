import type React from "react"
import { AlignJustify, Box } from "lucide-react"

interface componentItem {
    type: string,
    name: string,
    icon: React.ReactNode
}

function PanelItem({ name, icon }: Omit<componentItem, "type">) {
    return (
        <div className="w-[110px] h-[110px] flex flex-col items-center justify-evenly 
                        border border-gray-300 cursor-grab">
            <div>
                {icon}
            </div>
            <p>
                {name}
            </p>
        </div>
    )
}

export default function BasicPanel() {
    const component: componentItem[] = [
        {
            type: "text",
            name: "文字组件",
            icon: <AlignJustify />
        },
        {

            type: "image",
            name: "图片组件",
            icon: <AlignJustify />
        },
        {
            type: "container",
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
                        name={item.name} 
                        icon={item.icon}
                    />
                ))
            }
        </div>
    )
}