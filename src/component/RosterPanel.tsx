import { Download } from "lucide-react";
import { Badge } from "@/components/ui/8bit/badge";
import { Button } from "@/components/ui/8bit/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/8bit/card";
import ModelList from "./ModelList";
import type { SelectedModel } from "../constants/appConstants";

interface RosterPanelProps {
    selectedModel: SelectedModel;
    canManageModels: boolean;
    isUnloading: boolean;
    onUnloadModel: () => void;
}

/**
 * Rank 3 zone: the model party. Hosts the existing model picker and shows the
 * active model as an "equipped" badge. The unmount control renders only when
 * the active provider reports `capabilities.canManageModels`.
 */
const RosterPanel = ({
    selectedModel,
    canManageModels,
    isUnloading,
    onUnloadModel
}: RosterPanelProps) => {
    const hasSelectedModel = Boolean(selectedModel.key);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm">Roster</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <ModelList />

                <div className="flex flex-col gap-2">
                    <span className="retro text-[10px] uppercase text-muted-foreground">
                        Equipado
                    </span>

                    <Badge
                        variant={hasSelectedModel ? "secondary" : "outline"}
                        className="w-fit"
                    >
                        {selectedModel.displayName || "No hay modelo elegido"}
                    </Badge>
                </div>

                {hasSelectedModel && canManageModels && (
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isUnloading}
                        onClick={onUnloadModel}
                        className="w-fit"
                    >
                        <Download className="size-3" />
                        Desmontar
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default RosterPanel;
