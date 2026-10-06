import { Badge } from "@/components/ui/8bit/badge";
import ProviderSelector from "./ProviderSelector";
import type { AppConfig } from "../constants/appConfig";

interface HudBannerProps {
    appConfig: AppConfig;
    providerLabel: string;
}

/**
 * Rank 1 zone: identity plate plus the provider loadout. The title plate is the
 * banner/ribbon treatment; the provider selector (still Ant Design in this
 * slice) is the loadout control and stays a single source of truth for the
 * active provider.
 */
const HudBanner = ({ appConfig, providerLabel }: HudBannerProps) => {
    return (
        <header className="flex flex-col gap-4 border-4 border-foreground bg-card p-4 text-card-foreground lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2">
                <Badge variant="secondary" className="w-fit text-[10px]">
                    {appConfig.name}
                </Badge>

                <h1 className="retro text-base leading-relaxed text-balance lg:text-xl">
                    {appConfig.title}
                </h1>

                <p className="text-sm text-muted-foreground">
                    {appConfig.tagline}
                </p>
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
                <span className="retro text-[10px] uppercase text-muted-foreground">
                    Loadout: {providerLabel || "sin proveedor"}
                </span>

                <ProviderSelector />
            </div>
        </header>
    );
};

export default HudBanner;
