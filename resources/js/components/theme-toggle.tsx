import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

/**
 * Bascule mode clair / mode sombre en un clic (le choix est mémorisé).
 * Le réglage « Appareil » reste disponible dans Paramètres > Apparence.
 */
export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <button
            type="button"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            aria-label={
                isDark ? 'Passer en mode clair' : 'Passer en mode sombre'
            }
            title={isDark ? 'Mode clair' : 'Mode sombre'}
            className={cn(
                'relative grid size-10 place-items-center overflow-hidden rounded-full transition',
                className,
            )}
        >
            <Sun
                className={cn(
                    'absolute size-5 transition duration-500',
                    isDark ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0',
                )}
                aria-hidden
            />
            <Moon
                className={cn(
                    'absolute size-5 transition duration-500',
                    isDark ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100',
                )}
                aria-hidden
            />
        </button>
    );
}
