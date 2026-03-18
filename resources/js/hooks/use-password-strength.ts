import { useMemo } from 'react';

export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very_strong';

export interface PasswordRequirements {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numberOrSymbol: boolean;
}

export interface PasswordStrengthResult {
    strength: PasswordStrength;
    score: number;
    requirements: PasswordRequirements;
}

export function usePasswordStrength(password: string): PasswordStrengthResult {
    return useMemo(() => {
        const requirements: PasswordRequirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numberOrSymbol: /[^a-zA-Z]/.test(password), // Anything that is not a letter
        };

        if (!password) {
            return {
                strength: 'weak',
                score: 0,
                requirements: {
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    numberOrSymbol: false,
                },
            };
        }

        let score = 0;
        if (requirements.length) score += 1;
        if (requirements.uppercase) score += 1;
        if (requirements.lowercase) score += 1;
        if (requirements.numberOrSymbol) score += 1;

        // Bonus for extra length if other requirements are partially met
        if (password.length >= 12) score += 1;

        let strength: PasswordStrength = 'weak';
        if (score >= 4) {
            strength = 'very_strong';
        } else if (score === 3) {
            strength = 'strong';
        } else if (score === 2) {
            strength = 'medium';
        }

        return {
            strength,
            // Cap visual score to 4
            score: Math.min(score, 4),
            requirements,
        };
    }, [password]);
}
