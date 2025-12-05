import { useEffect, useState } from "react";
import type { RendererProps } from "@/core/schema/types";
import type { ClockComponent } from "@/core/schema/basic";
import dayjs from "dayjs";

/**
 * 时钟组件渲染实现
 * 根据 Clock 节点的 props 实时展示当前时间
 */
export default function Clock({ node }: RendererProps) {
  const props = node.props as ClockComponent["props"];
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, props.showSeconds === false ? 60000 : 1000);

    return () => {
      clearInterval(timer);
    };
  }, [props.showSeconds]);

  return (
    <div
      style={{
        fontSize: `${props.fontSize}px`,
        fontWeight: props.fontWeight,
        color: props.color,
        textAlign: props.textAlign,
      }}
    >
      {dayjs(now).format(props.format)}
    </div>
  );
}


