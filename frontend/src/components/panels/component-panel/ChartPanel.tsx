import type React from "react"
import { BarChart2, LineChart, PieChart } from "lucide-react"
import DraggableItem from "@/core/dnd/DraggableItem"

interface ChartItem {
    type: string,
    name: string,
    icon: React.ReactNode
}

/**
 * 图表单元项
 * - 作为二级菜单的最小展示单元，可拖拽创建对应类型的图表组件
 */
function ChartPanelItem({ type, name, icon }: ChartItem) {
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

/**
 * 图表组件面板
 * - 作为 SidebarMenu 中的「图表组件」子面板
 * - 支持展示多种图表类型（柱状图、折线图、饼图等）
 */
export default function ChartPanel() {
    const chartItems: ChartItem[] = [
        {
            type: "BarChart",
            name: "柱状图",
            icon: <BarChart2 />
        },
        {
            type: "LineChart",
            name: "折线图（预留）",
            icon: <LineChart />
        },
        {
            type: "PieChart",
            name: "饼图（预留）",
            icon: <PieChart />
        }
    ]

    return (
        <div className="w-[265px] grid grid-cols-2 grid-rows-component gap-[15px] p-[15px]">
            {
                chartItems.map(item => (
                    <ChartPanelItem 
                        key={item.type}
                        {...item}
                    />
                ))
            }
        </div>
    )
}