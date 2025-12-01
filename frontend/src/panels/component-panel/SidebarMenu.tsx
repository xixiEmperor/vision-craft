import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Puzzle, ChartArea } from 'lucide-react';
import BasicPanel from './BasicPanel';
import ChartPanel from './ChartPanel';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: 'basic', icon: <Puzzle />, label: '基础组件' },
  { key: 'charts', icon: <ChartArea />, label: '图表组件' },
];

type ItemType = 'basic' | 'charts'

export default function SidebarMenu ({ className }: {className?: string}) {
    const [selectedKey, setSelectedKey] = useState<ItemType>('basic'); // 当前选中的组件类型

    const handleItemSelected = ({ key }: {key: string}) => {
        setSelectedKey(key as ItemType);
    }

    return (
        <div className={`flex ${className}`}>
            <Menu 
                className='w-[135px]'
                defaultSelectedKeys={[selectedKey]}
                mode="vertical" 
                items={items} 
                onSelect={handleItemSelected}
            />

            {/* 渲染对应组件 */}

            { selectedKey === 'basic' && <BasicPanel /> }

            { selectedKey === 'charts' && <ChartPanel /> }
        </div>
    )
}