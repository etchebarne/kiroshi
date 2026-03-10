import { useEffect, useRef } from "react";

interface ContextMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
  scale?: number;
}

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Adjust position to keep menu within viewport (scaled coordinates)
  const adjustedX = Math.min(x, 1440 - 200);
  const adjustedY = Math.min(y, 1024 - items.length * 50);

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] -skew-x-[10deg]"
      style={{
        left: adjustedX,
        top: adjustedY,
        minWidth: 240,
      }}
    >
      <div className="p-6 flex flex-col gap-4 skew-x-[10deg]">
        {items.map((item, index) => (
          <button
            key={index}
            className={`w-full px-6 py-3 text-center border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all -skew-x-[10deg] ${
              item.danger
                ? "bg-[#ef3c3c] text-white hover:bg-[#cc2e2e]"
                : "bg-[#f0f4ff] text-black hover:bg-white"
            }`}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            <span className="block skew-x-[10deg] text-[20px] font-black italic uppercase tracking-tighter">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
