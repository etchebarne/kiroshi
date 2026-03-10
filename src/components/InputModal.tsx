import { useEffect, useRef, useState } from "react";

interface InputModalProps {
  title: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function InputModal({
  title,
  placeholder = "",
  initialValue = "",
  confirmLabel = "Guardar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: InputModalProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white border-4 border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] w-[500px] -skew-x-[10deg]">
        <div className="bg-[#3e61ff] px-6 py-4 border-b-4 border-black flex justify-between items-center">
          <h2 className="text-white text-[28px] font-black italic uppercase tracking-tighter skew-x-[10deg]">{title}</h2>
          <div className="w-[80px] h-[8px] bg-white skew-x-[10deg]" />
        </div>
        <form onSubmit={handleSubmit} className="p-8 skew-x-[10deg]">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-6 py-4 text-[24px] font-bold text-black border-4 border-black bg-white focus:bg-[#f0f4ff] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all mb-8 placeholder:text-gray-400 placeholder:italic -skew-x-[10deg]"
          />
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 bg-white text-black border-4 border-black text-[20px] font-black italic uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all -skew-x-[10deg]"
            >
              <span className="skew-x-[10deg] block">{cancelLabel}</span>
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="px-8 py-3 bg-[#3e61ff] hover:bg-[#2d4ecc] disabled:bg-gray-400 text-white border-4 border-black text-[20px] font-black italic uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:translate-x-[4px] disabled:translate-y-[4px] disabled:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all -skew-x-[10deg]"
            >
              <span className="skew-x-[10deg] block">{confirmLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
