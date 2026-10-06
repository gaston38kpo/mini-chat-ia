import type React from "react";

interface GameShellProps {
    hud: React.ReactNode;
    roster: React.ReactNode;
    chronicle: React.ReactNode;
    status: React.ReactNode;
}

/**
 * Full-viewport RPG console shell. Pure layout: it only places the four zone
 * nodes it receives and owns no data.
 *
 * Ranks, per the design zoning:
 *   <md  single column stack: HUD -> roster -> chronicle -> status
 *   md   same stack, roster capped as a slim scrollable rail above the chronicle
 *   lg+  two columns: HUD/status span both, roster is the left rail, chronicle fills
 */
const GameShell = ({ hud, roster, chronicle, status }: GameShellProps) => {
    return (
        <div className="grid h-dvh w-full grid-cols-1 grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-3 overflow-hidden bg-background p-3 text-foreground lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)_auto]">
            <div className="min-w-0 lg:col-span-2">{hud}</div>

            <div className="min-h-0 overflow-y-auto md:max-h-56 lg:col-start-1 lg:row-start-2 lg:max-h-none">
                {roster}
            </div>

            <div className="min-h-0 lg:col-start-2 lg:row-start-2">{chronicle}</div>

            <div className="min-w-0 lg:col-span-2">{status}</div>
        </div>
    );
};

export default GameShell;
