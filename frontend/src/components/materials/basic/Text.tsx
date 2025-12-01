import type { RendererProps } from "@/core/schema/types";
import type { TextComponent } from "@/core/schema/basic";

export default function Text({ node }: RendererProps) {
    const props = node.props as TextComponent['props'];
    console.log("Text props:", props);
    return (
        <div 
            style={{
                fontSize: props.fontSize + 'px', 
                fontWeight: props.fontWeight, 
                color: props.color, 
                textAlign: props.textAlign
            }}
        >
            { props.content }
        </div>
    );
}