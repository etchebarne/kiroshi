import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useRaces } from "../hooks/useRaces";

export function RacesListSelector() {
  const [scale, setScale] = useState(1);
  const navigate = useNavigate();
  const { data: races, isLoading } = useRaces();

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / 1440;
      const scaleY = window.innerHeight / 1024;
      setScale(Math.min(scaleX, scaleY));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate({ to: "/" });
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#ececec]">
      <div
        data-scaled-container
        className="w-[1440px] h-[1024px] font-['Chivo_Mono',monospace] shrink-0 relative"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Header */}
        <div className="absolute left-[40px] top-[40px] right-[40px]">
          <div className="bg-[#ef3c3c] h-[100px] flex items-center justify-between px-[60px] border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] -skew-x-[10deg]">
            <div className="flex items-center gap-4 skew-x-[10deg]">
              <button
                onClick={() => navigate({ to: "/" })}
                className="text-black bg-white border-4 border-black w-12 h-12 flex items-center justify-center text-[28px] font-black italic hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all -skew-x-[10deg] mr-2"
              >
                <span className="skew-x-[10deg] leading-none mb-1">&larr;</span>
              </button>
              <h1 className="text-white text-[48px] font-black italic uppercase tracking-tighter">Seleccionar Carrera</h1>
            </div>
          </div>
        </div>

        {/* Races List */}
        <div className="absolute left-[40px] top-[180px] right-[40px] bottom-[40px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-[32px] font-black italic uppercase text-gray-400">Cargando...</span>
            </div>
          ) : races && races.length > 0 ? (
            <div className="grid grid-cols-2 gap-[30px] px-[20px] pt-[10px] pb-8">
              {races.map((race) => (
                <div
                  key={race.id}
                  onClick={() => navigate({ to: "/carrera/$raceId", params: { raceId: String(race.id) } })}
                  className="group relative bg-white border-4 border-black p-[30px] cursor-pointer transition-all -skew-x-[10deg] shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none overflow-hidden"
                >
                  <div className="skew-x-[10deg]">
                    <h2 className="text-[32px] font-black italic uppercase tracking-tighter text-black mb-2 group-hover:text-[#ef3c3c] transition-colors">
                      {race.name}
                    </h2>
                    <p className="text-[18px] font-bold text-gray-500 uppercase">
                      Creada: {new Date(race.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Decorative stripe */}
                  <div className="absolute top-0 right-0 w-[20px] h-full bg-[#ef3c3c] translate-x-[20px] group-hover:translate-x-0 transition-transform" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <span className="text-[32px] font-black italic uppercase text-gray-400">
                No hay carreras disponibles
              </span>
              <p className="text-[20px] font-bold text-gray-400 uppercase italic">
                Crea carreras en el modo Carga para poder seleccionarlas aqui
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
