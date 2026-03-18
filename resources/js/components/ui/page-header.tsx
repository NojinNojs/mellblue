import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionIcon?: React.ReactNode;
    onAction?: () => void;
}

export function PageHeader({
    title,
    description,
    actionLabel,
    actionIcon = <Plus className="mr-2 h-4 w-4" />,
    onAction,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    {actionIcon}
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
