import { useId, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/8bit/badge";
import { Button } from "@/components/ui/8bit/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/8bit/popover";
import { Spinner } from "@/components/ui/8bit/spinner";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useModelStore } from "../store/modelStore";
import useModelList from "./useModelList";

/**
 * Roster model picker. The 8bitcn combo-box slug ships no component file, so the
 * picker is composed from its registry parts: popover + command + button. cmdk
 * owns the query filter; selection still flows through `useModelList` unchanged.
 *
 * Selection is unavailable while a model loads or before the list arrives: the
 * trigger is disabled and the popover refuses to open.
 */
const ModelList = () => {
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
    const selectedModel = useModelStore((state) => state.selectedModel);
    const { models, loadingKey, canManageModels, onClickModel } = useModelList({ setSelectedModel });

    const labelId = useId();
    const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

    const isLoading = canManageModels && loadingKey !== null;
    const isUnavailable = isLoading || models.length === 0;

    const onSelectModel = (key: string): void => {
        setIsPickerOpen(false);

        if (key === selectedModel.key) return;

        const model = models.find((item) => item.key === key);

        if (!model) return;

        onClickModel(model.key, model.displayName);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span id={labelId} className="retro text-[10px] uppercase text-muted-foreground">
                    Elegí uno
                </span>

                <Badge variant="secondary" className="text-[10px]">
                    {models.length} disponibles
                </Badge>
            </div>

            <Popover
                open={isPickerOpen}
                onOpenChange={(open) => setIsPickerOpen(isUnavailable ? false : open)}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isPickerOpen}
                        aria-labelledby={labelId}
                        disabled={isUnavailable}
                        className="w-full justify-between"
                    >
                        <span className="truncate">
                            {selectedModel.displayName || "Elegí un modelo"}
                        </span>

                        {isLoading ? (
                            <Spinner className="size-4" />
                        ) : (
                            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                >
                    <Command>
                        <CommandInput placeholder="Buscar modelo" />

                        <CommandList label="Modelos disponibles" className="max-h-56">
                            <CommandEmpty>Sin resultados</CommandEmpty>

                            <CommandGroup>
                                {models.map((model) => {
                                    const isSelected = model.key === selectedModel.key;

                                    return (
                                        <CommandItem
                                            key={model.key}
                                            onSelect={() => onSelectModel(model.key)}
                                        >
                                            <Check
                                                className={cn(
                                                    "size-3 shrink-0",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />

                                            <span className="truncate">{model.displayName}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default ModelList;
