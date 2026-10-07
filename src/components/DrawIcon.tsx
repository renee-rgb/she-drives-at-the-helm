import React from "react";
import { icons } from "lucide";
import { C } from "../theme";

// A Lucide icon that draws itself on like a pen: every stroke animates with pathLength.
// name is kebab-case ("arrow-down"); draw 0..1.
const toPascal = (n: string) => n.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");

export const DrawIcon: React.FC<{ readonly name: string; readonly draw: number; readonly size?: number; readonly color?: string; readonly strokeWidth?: number }> = ({
  name,
  draw,
  size = 40,
  color = C.ink,
  strokeWidth = 2.4,
}) => {
  const node = (icons as any)[toPascal(name)] as [string, Record<string, string>][] | undefined;
  if (!node) return null;
  const n = node.length;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {node.map(([tag, attrs], i) => {
        // strokes draw in sequence
        const local = Math.max(0, Math.min(1, draw * n - i));
        return React.createElement(tag, { key: i, ...attrs, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - local });
      })}
    </svg>
  );
};
