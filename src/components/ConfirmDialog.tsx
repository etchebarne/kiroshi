import { useEffect } from "react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onConfirm, onCancel]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white border-4 border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] w-[500px] -skew-x-[10deg]">
        <div className={`px-6 py-4 border-b-4 border-black flex justify-between items-center ${danger ? 'bg-[#ef3c3c]' : 'bg-[#3e61ff]'}`}>
          <h2 className="text-white text-[28px] font-black italic uppercase tracking-tighter skew-x-[10deg]">{title}</h2>
          <div className="w-[80px] h-[8px] bg-white skew-x-[10deg]" />
        </div>
        <div className="p-8 skew-x-[10deg]">
          <p className="text-black text-[20px] font-bold mb-8 uppercase leading-tight">{message}</p>
          <div className="flex gap-4 justify-end">
            <button
              onClick={onCancel}
              className="px-8 py-3 bg-white text-black border-4 border-black text-[20px] font-black italic uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all -skew-x-[10deg]"
            >
              <span className="skew-x-[10deg] block">{cancelLabel}</span>
            </button>
            <button
              onClick={onConfirm}
              className={`px-8 py-3 text-white border-4 border-black text-[20px] font-black italic uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all -skew-x-[10deg] ${
                danger
                  ? "bg-[#ef3c3c] hover:bg-[#cc2e2e]"
                  : "bg-[#3e61ff] hover:bg-[#2d4ecc]"
              }`}
            >
              <span className="skew-x-[10deg] block">{confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
