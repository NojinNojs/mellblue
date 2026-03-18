import {
    usePasswordStrength,
    type PasswordStrength,
} from '@/hooks/use-password-strength';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
    password: string;
}

export function PasswordStrengthIndicator({
    password,
}: PasswordStrengthIndicatorProps) {
    const { strength, score, requirements } = usePasswordStrength(password);

    const strengthConfig = useMemo(() => {
        const configs: Record<
            PasswordStrength,
            { label: string; color: string; textColor: string }
        > = {
            weak: {
                label: 'Weak',
                color: 'bg-red-500',
                textColor: 'text-red-500 dark:text-red-400',
            },
            medium: {
                label: 'Medium',
                color: 'bg-yellow-500',
                textColor: 'text-yellow-600 dark:text-yellow-400',
            },
            strong: {
                label: 'Strong',
                color: 'bg-green-500',
                textColor: 'text-green-600 dark:text-green-400',
            },
            very_strong: {
                label: 'Very Strong',
                color: 'bg-emerald-500',
                textColor: 'text-emerald-600 dark:text-emerald-400',
            },
        };
        return configs[strength];
    }, [strength]);

    if (!password) {
        return null;
    }

    const reqs = [
        { label: 'At least 8 characters', met: requirements.length },
        { label: 'Uppercase letter', met: requirements.uppercase },
        { label: 'Lowercase letter', met: requirements.lowercase },
        { label: 'Number or symbol', met: requirements.numberOrSymbol },
    ];

    return (
        <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between">
                <span
                    className={cn(
                        'text-xs font-medium transition-colors',
                        strengthConfig.textColor,
                    )}
                >
                    Password strength: {strengthConfig.label}
                </span>
            </div>

            <div className="flex w-full gap-1.5">
                {[1, 2, 3, 4].map((level) => {
                    const isFilled =
                        score >= level || (score >= 4 && level === 4);
                    return (
                        <div
                            key={level}
                            className={cn(
                                'h-1.5 flex-1 rounded-full transition-all duration-300',
                                isFilled ? strengthConfig.color : 'bg-muted',
                            )}
                        />
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
                {reqs.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                            <X className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                        <span
                            className={cn(
                                'text-xs transition-colors',
                                req.met
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
