import { useSchemaStore } from '@/store/schema-store';

/**
 * 空页面模板组件
 * 用于提示用户拖拽组件到此处
 */
export default function EmptyTemplate() {
    const schemaStore = useSchemaStore();
    
    return (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 
                        rounded-lg bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors 
                        duration-200 p-8 h-[100vh]"
        >
            <div className="text-center">
                <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    拖拽组件到此处
                </h3>
                <p className="text-sm text-gray-500">
                    从左侧面板选择组件并拖拽到这个区域开始设计
                </p>
            </div>
            <div className="mt-4">
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => schemaStore.setSchema()}
                >
                    开始设计
                </button>
            </div>
        </div>
    );
}