import type { SVGAttributes } from 'react';

/**
 * Logo Kanvô : deux bandes verticales et deux bandes horizontales entrelacées,
 * dessus-dessous, comme les fils d'un pagne tissé. Une seule couleur (currentColor).
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            {/* Bandes verticales (chaîne) */}
            <rect x="8" y="3" width="8" height="19.5" rx="1" />
            <rect x="8" y="33.5" width="8" height="3.5" rx="1" />
            <rect x="24" y="3" width="8" height="3.5" rx="1" />
            <rect x="24" y="17.5" width="8" height="19.5" rx="1" />
            {/* Bandes horizontales (trame), un peu plus claires */}
            <g opacity="0.6">
                <rect x="3" y="8" width="3.5" height="8" rx="1" />
                <rect x="17.5" y="8" width="19.5" height="8" rx="1" />
                <rect x="3" y="24" width="19.5" height="8" rx="1" />
                <rect x="33.5" y="24" width="3.5" height="8" rx="1" />
            </g>
        </svg>
    );
}
