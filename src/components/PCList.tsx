import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useRace, useUpdateRace } from "../hooks/useRaces";
import { usePCsByRace, useCreatePC, useDeletePC } from "../hooks/usePCs";
import { ContextMenu } from "./ContextMenu";
import { ConfirmDialog } from "./ConfirmDialog";
import { InputModal } from "./InputModal";
import type { PC } from "../types";

interface PCListProps {
  raceId: number;
}

export function PCList({ raceId }: PCListProps) {
  const [scale, setScale] = useState(1);
  const navigate = useNavigate();
  const { data: race } = useRace(raceId);
  const { data: pcs, isLoading } = usePCsByRace(raceId);
  const createPC = useCreatePC();
  const deletePC = useDeletePC();
  const updateRace = useUpdateRace();

  const [editingRaceName, setEditingRaceName] = useState(false);
  const [deletingPC, setDeletingPC] = useState<PC | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    pc: PC;
  } | null>(null);

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / 1440;
      const scaleY = window.innerHeight / 1024;
      setScale(Math.min(scaleX, scaleY));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (contextMenu) {
          setContextMenu(null);
        } else if (editingRaceName) {
          setEditingRaceName(false);
        } else if (deletingPC) {
          setDeletingPC(null);
        } else {
          navigate({ to: "/races" });
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, contextMenu, editingRaceName, deletingPC]);

  const handleContextMenu = (e: React.MouseEvent, pc: PC) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement)
      .closest("[data-scaled-container]")
      ?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      setContextMenu({ x, y, pc });
    }
  };

  const handleCreatePC = async () => {
    const newPC = await createPC.mutateAsync(raceId);
    navigate({
      to: "/races/$raceId/$pcId",
      params: { raceId: String(raceId), pcId: String(newPC.id) },
    });
  };

  const handleDeletePC = async () => {
    if (deletingPC) {
      await deletePC.mutateAsync(deletingPC.id);
      setDeletingPC(null);
    }
  };

  const handleUpdateRaceName = async (name: string) => {
    await updateRace.mutateAsync({ id: raceId, name });
    setEditingRaceName(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#ececec]">
      <div
        data-scaled-container
        className="w-[1440px] h-[1024px] font-['Chivo_Mono',monospace] shrink-0 relative"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Header */}
        <div className="absolute left-[40px] top-[40px] right-[40px]">
          <div className="bg-[#3e61ff] h-[100px] flex items-center justify-between px-[60px] border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] -skew-x-[10deg]">
            <div className="flex items-center gap-4 skew-x-[10deg]">
              <button
                onClick={() => navigate({ to: "/races" })}
                className="text-black bg-white border-4 border-black w-12 h-12 flex items-center justify-center text-[28px] font-black italic hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all -skew-x-[10deg] mr-2"
              >
                <span className="skew-x-[10deg] leading-none mb-1">&larr;</span>
              </button>
              <h1
                onClick={() => setEditingRaceName(true)}
                className="text-white text-[48px] font-black italic uppercase tracking-tighter cursor-pointer hover:text-black transition-colors"
                title="Click para editar nombre"
              >
                {race?.name || "Cargando..."}
              </h1>
            </div>
            <button
              onClick={handleCreatePC}
              className="bg-white hover:bg-gray-200 text-black border-4 border-black px-8 py-2 text-[24px] font-black italic uppercase tracking-tighter shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all skew-x-[10deg]"
            >
              Crear PC
            </button>
          </div>
        </div>

        {/* PC List */}
        <div className="absolute left-[40px] top-[180px] right-[40px] bottom-[40px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-[32px] font-black italic uppercase text-gray-400">Cargando...</span>
            </div>
          ) : pcs && pcs.length > 0 ? (
            <div className="grid grid-cols-4 gap-[30px] px-[20px] pt-[10px] pb-8">
              {pcs.map((pc) => (
                <div
                  key={pc.id}
                  onClick={() =>
                    navigate({
                      to: "/races/$raceId/$pcId",
                      params: { raceId: String(raceId), pcId: String(pc.id) },
                    })
                  }
                  onContextMenu={(e) => handleContextMenu(e, pc)}
                  className="group relative bg-white border-4 border-black p-[30px] cursor-pointer transition-all -skew-x-[10deg] shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none overflow-hidden flex flex-col items-center justify-center"
                >
                  <div className="skew-x-[10deg] flex flex-col items-center z-10">
                    <span className="text-[24px] text-black font-black italic uppercase mb-2 group-hover:text-[#3e61ff] transition-colors">
                      PC
                    </span>
                    <span className="text-[72px] font-black italic text-black leading-none group-hover:scale-110 transition-transform">
                      {pc.pc_number}
                    </span>
                  </div>
                  {/* Decorative stripe */}
                  <div className="absolute top-0 right-0 w-[20px] h-full bg-[#3e61ff] translate-x-[20px] group-hover:translate-x-0 transition-transform" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <span className="text-[32px] font-black italic uppercase text-gray-400">No hay PCs</span>
              <button
                onClick={handleCreatePC}
                className="bg-white hover:bg-gray-200 text-black border-4 border-black px-12 py-6 text-[28px] font-black italic uppercase tracking-tighter shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all -skew-x-[10deg]"
              >
                <span className="block skew-x-[10deg]">Crear Primer PC</span>
              </button>
            </div>
          )}
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            scale={scale}
            items={[
              {
                label: "Editar",
                onClick: () =>
                  navigate({
                    to: "/races/$raceId/$pcId",
                    params: {
                      raceId: String(raceId),
                      pcId: String(contextMenu.pc.id),
                    },
                  }),
              },
              {
                label: "Eliminar",
                onClick: () => setDeletingPC(contextMenu.pc),
                danger: true,
              },
            ]}
            onClose={() => setContextMenu(null)}
          />
        )}

        {/* Edit Race Name Modal */}
        {editingRaceName && race && (
          <InputModal
            title="Editar Carrera"
            placeholder="Nombre de la carrera"
            initialValue={race.name}
            onConfirm={handleUpdateRaceName}
            onCancel={() => setEditingRaceName(false)}
          />
        )}

        {/* Delete Confirmation */}
        {deletingPC && (
          <ConfirmDialog
            title="Eliminar PC"
            message={`¿Estás seguro de que quieres eliminar PC ${deletingPC.pc_number}? Esta acción eliminará todas las referencias asociadas.`}
            confirmLabel="Eliminar"
            onConfirm={handleDeletePC}
            onCancel={() => setDeletingPC(null)}
            danger
          />
        )}
      </div>
    </div>
  );
}
