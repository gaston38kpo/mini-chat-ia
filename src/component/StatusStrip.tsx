import { Progress } from "@/components/ui/8bit/progress";

interface StatusStripProps {
    messageCount: number;
    connectionLabel: string;
    isSending: boolean;
}

/**
 * Rank 4 zone: ambient HUD strip. Quietest rank. The activity meter is a
 * boolean indicator driven by `isSending` (full when sending, empty when idle),
 * never a fabricated percentage.
 */
const StatusStrip = ({
    messageCount,
    connectionLabel,
    isSending
}: StatusStripProps) => {
    return (
        <footer className="flex flex-col gap-3 border-4 border-foreground bg-card px-4 py-2 text-card-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
                <span className="retro text-[10px] uppercase">
                    Mensajes: {messageCount}
                </span>

                <span className="retro text-[10px] uppercase text-muted-foreground">
                    Conexion: {connectionLabel || "sin proveedor"}
                </span>
            </div>

            <div className="flex items-center gap-3 sm:w-64">
                <span className="retro text-[10px] uppercase text-muted-foreground">
                    {isSending ? "Enviando" : "En espera"}
                </span>

                <Progress
                    value={isSending ? 100 : 0}
                    variant="retro"
                    className="h-4 flex-1"
                    aria-label={isSending ? "Enviando mensaje" : "Sin actividad"}
                />
            </div>
        </footer>
    );
};

export default StatusStrip;
