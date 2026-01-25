import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface StatusSwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    description?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
}

export function StatusSwitch({
    checked,
    onCheckedChange,
    label,
    description,
    disabled = false,
    id,
    className,
}: StatusSwitchProps) {
    const generatedId = React.useId();
    const switchId = id || `status-switch-${generatedId}`;

    return (
        <div className={cn("flex items-center justify-between space-x-2", className)}>
            <div className="flex-1 space-y-0.5">
                <Label
                    htmlFor={switchId}
                    className={cn(
                        "text-base font-medium cursor-pointer",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    {label}
                </Label>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            <Switch
                id={switchId}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
            />
        </div>
    );
}
