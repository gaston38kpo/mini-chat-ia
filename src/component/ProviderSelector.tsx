import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/8bit/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/8bit/dialog";
import { Input } from "@/components/ui/8bit/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/8bit/select";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel
} from "@/components/ui/field";
import { useProviderStore, type ProviderConfig } from "../store/providerStore";
import type { ProviderKind } from "../chat/providers";

const KIND_OPTIONS: Array<{ value: ProviderKind; label: string }> = [
    { value: "openai-compatible", label: "OpenAI-compatible (proxy, p. ej. OpenCode Go)" },
    { value: "lmstudio", label: "LM Studio" }
];

interface ProviderFormValues {
    label: string;
    kind: ProviderKind;
    baseUrl: string;
    apiKey?: string;
}

type ProviderFormErrors = Partial<Record<"label" | "kind" | "baseUrl", string>>;

const EMPTY_FORM_VALUES: ProviderFormValues = {
    label: "",
    kind: "openai-compatible",
    baseUrl: "",
    apiKey: ""
};

/** Manual validation: no form schema dependency, required values must be non-empty after trim. */
const validateProviderForm = (values: ProviderFormValues): ProviderFormErrors => {
    const errors: ProviderFormErrors = {};

    if (!values.label.trim()) errors.label = "Ponele un nombre";

    if (!values.kind) errors.kind = "Elegí un tipo de proveedor";

    if (!values.baseUrl.trim()) errors.baseUrl = "La URL base es obligatoria";

    return errors;
};

/**
 * Rank 1 loadout control plus the RPG-window provider dialog. The dialog owns
 * manual field validation and writes to the provider store only when every
 * required value is valid. Delete stays hidden while a single provider exists.
 */
const ProviderSelector = () => {
    const providers = useProviderStore((state) => state.providers);
    const activeProviderId = useProviderStore((state) => state.activeProviderId);
    const setActiveProvider = useProviderStore((state) => state.setActiveProvider);
    const addProvider = useProviderStore((state) => state.addProvider);
    const updateProvider = useProviderStore((state) => state.updateProvider);
    const removeProvider = useProviderStore((state) => state.removeProvider);

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [editingProvider, setEditingProvider] = useState<ProviderConfig | null>(null);
    const [values, setValues] = useState<ProviderFormValues>(EMPTY_FORM_VALUES);
    const [errors, setErrors] = useState<ProviderFormErrors>({});

    const clearFieldError = (field: "label" | "kind" | "baseUrl"): void => {
        setErrors((current) => {
            if (!current[field]) return current;

            const nextErrors = { ...current };

            delete nextErrors[field];

            return nextErrors;
        });
    };

    const onChangeText = (field: "label" | "baseUrl" | "apiKey") => (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        const { value } = event.target;

        setValues((current) => ({ ...current, [field]: value }));

        if (field === "label" || field === "baseUrl") {
            clearFieldError(field);
        }
    };

    const onChangeKind = (kind: string): void => {
        setValues((current) => ({ ...current, kind: kind as ProviderKind }));
        clearFieldError("kind");
    };

    const openCreateDialog = (): void => {
        setEditingProvider(null);
        setValues(EMPTY_FORM_VALUES);
        setErrors({});
        setIsDialogOpen(true);
    };

    const openEditDialog = (): void => {
        const current = providers.find((provider) => provider.id === activeProviderId);

        if (!current) return;

        setEditingProvider(current);
        setValues({
            label: current.label,
            kind: current.kind,
            baseUrl: current.baseUrl,
            apiKey: current.apiKey
        });
        setErrors({});
        setIsDialogOpen(true);
    };

    const closeDialog = (): void => {
        setIsDialogOpen(false);
        setEditingProvider(null);
        setErrors({});
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const nextErrors = validateProviderForm(values);

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;

        const payload = {
            label: values.label.trim(),
            kind: values.kind,
            baseUrl: values.baseUrl.trim(),
            apiKey: (values.apiKey ?? "").trim()
        };

        if (editingProvider) {
            updateProvider(editingProvider.id, payload);
        } else {
            const id = addProvider(payload);

            setActiveProvider(id);
        }

        closeDialog();
    };

    const onDelete = (): void => {
        if (!editingProvider || providers.length <= 1) return;

        removeProvider(editingProvider.id);
        closeDialog();
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="retro text-[10px] uppercase text-muted-foreground">Proveedor</span>

            <div className="flex flex-wrap items-center gap-2">
                <Select value={activeProviderId ?? undefined} onValueChange={setActiveProvider}>
                    <SelectTrigger
                        className="min-w-[200px]"
                        aria-label="Elegí un proveedor"
                    >
                        <SelectValue placeholder="Elegí un proveedor" />
                    </SelectTrigger>

                    <SelectContent>
                        {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                                {provider.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={openEditDialog} disabled={!activeProviderId}>
                    Editar
                </Button>

                <Button onClick={openCreateDialog}>Agregar</Button>
            </div>

            <p className="max-w-[560px] text-xs text-muted-foreground">
                Las API keys se guardan en este navegador (localStorage). Un backend que no esté
                proxeado en el dev server puede fallar por CORS.
            </p>

            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) closeDialog();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingProvider ? "Editar proveedor" : "Agregar proveedor"}
                        </DialogTitle>

                        <DialogDescription>
                            Configurá un proveedor OpenAI-compatible o LM Studio.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                        <Field data-invalid={errors.label ? true : undefined}>
                            <FieldLabel htmlFor="provider-label">Nombre</FieldLabel>

                            <Input
                                id="provider-label"
                                value={values.label}
                                onChange={onChangeText("label")}
                                placeholder="OpenCode Go"
                                aria-invalid={Boolean(errors.label)}
                            />

                            <FieldError>{errors.label}</FieldError>
                        </Field>

                        <Field data-invalid={errors.kind ? true : undefined}>
                            <FieldLabel htmlFor="provider-kind">Tipo</FieldLabel>

                            <Select value={values.kind} onValueChange={onChangeKind}>
                                <SelectTrigger
                                    id="provider-kind"
                                    className="w-full"
                                    aria-invalid={Boolean(errors.kind)}
                                >
                                    <SelectValue placeholder="Elegí un tipo" />
                                </SelectTrigger>

                                <SelectContent>
                                    {KIND_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <FieldError>{errors.kind}</FieldError>
                        </Field>

                        <Field data-invalid={errors.baseUrl ? true : undefined}>
                            <FieldLabel htmlFor="provider-base-url">URL base</FieldLabel>

                            <Input
                                id="provider-base-url"
                                value={values.baseUrl}
                                onChange={onChangeText("baseUrl")}
                                placeholder="/opencode-go"
                                aria-invalid={Boolean(errors.baseUrl)}
                            />

                            <FieldDescription>
                                Relativa para usar el proxy de Vite (p. ej. /opencode-go) o absoluta
                                para un backend propio.
                            </FieldDescription>

                            <FieldError>{errors.baseUrl}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="provider-api-key">API key</FieldLabel>

                            <Input
                                id="provider-api-key"
                                type="password"
                                autoComplete="off"
                                value={values.apiKey ?? ""}
                                onChange={onChangeText("apiKey")}
                                placeholder="Opcional"
                            />

                            <FieldDescription>Opcional.</FieldDescription>
                        </Field>

                        <DialogFooter>
                            {editingProvider && providers.length > 1 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={onDelete}
                                    className="sm:mr-auto"
                                >
                                    Eliminar proveedor
                                </Button>
                            )}

                            <Button type="button" variant="outline" onClick={closeDialog}>
                                Cancelar
                            </Button>

                            <Button type="submit">
                                {editingProvider ? "Guardar" : "Agregar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProviderSelector;
