import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * Teintes associées aux couleurs déclarées par les vendeurs (config/kanvo.php).
 * Les clés sont normalisées : minuscules, sans accent.
 */
const COLOR_HEX: Record<string, string> = {
    blanc: '#f4efe6',
    noir: '#1b1a1f',
    indigo: '#26306b',
    bleu: '#2f5fa8',
    rouge: '#b8322a',
    bordeaux: '#6e1f2e',
    jaune: '#e8b931',
    or: '#c9a03a',
    orange: '#d9702a',
    vert: '#2f6b45',
    violet: '#5b3a7a',
    rose: '#d97a8c',
    marron: '#6b4228',
    beige: '#d8c7a6',
    gris: '#8a8a8a',
};

/** Palettes inspirées des pagnes tissés, utilisées quand aucune couleur n'est connue. */
const PALETTES = [
    ['#26306b', '#f4efe6', '#c9a03a', '#1b1a1f'],
    ['#6e1f2e', '#c9a03a', '#f4efe6', '#1b1a1f'],
    ['#2f6b45', '#e8b931', '#b8322a', '#1b1a1f'],
    ['#1b1a1f', '#f4efe6', '#d9702a', '#26306b'],
    ['#5b3a7a', '#e8b931', '#f4efe6', '#26306b'],
    ['#26306b', '#2f5fa8', '#f4efe6', '#c9a03a'],
];

const normalize = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim();

/** Petit générateur pseudo-aléatoire : un même texte donne toujours le même motif. */
function seededRandom(seed: string): () => number {
    let h = 1779033703 ^ seed.length;

    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }

    return () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        h ^= h >>> 16;

        return (h >>> 0) / 4294967296;
    };
}

/** Teinte d'une couleur déclarée ; null si elle n'est pas connue (ex. « Multicolore »). */
export function colorHex(color: string): string | null {
    return COLOR_HEX[normalize(color)] ?? null;
}

export function paletteFor(seed: string, colors: string[] = []): string[] {
    const known = colors
        .map((color) => COLOR_HEX[normalize(color)])
        .filter((hex): hex is string => Boolean(hex));

    if (known.length === 0) {
        const random = seededRandom(seed);

        return PALETTES[Math.floor(random() * PALETTES.length)];
    }

    /* Une ou deux couleurs seulement : on ajoute ivoire et encre pour le contraste. */
    const extras = ['#f4efe6', '#1b1a1f', '#c9a03a'].filter(
        (hex) => !known.includes(hex),
    );

    return [...known, ...extras].slice(0, Math.max(4, known.length));
}

type Segment = {
    y: number;
    h: number;
    kind: number;
    color: string;
    alt: string;
};

/**
 * Motif de pagne tissé en bandes (comme le kanvô) : des bandes étroites cousues côte à côte,
 * alternant rayures de chaîne et blocs à motifs (losanges, damiers, chevrons).
 */
export function WovenPattern({
    seed,
    colors,
    className,
    strips = 7,
}: {
    seed: string;
    colors?: string[];
    className?: string;
    strips?: number;
}) {
    const id = useId().replace(/:/g, '');
    const palette = paletteFor(seed, colors);
    const random = seededRandom(`${seed}-motif`);
    const width = 400;
    const height = 500;
    const stripWidth = width / strips;
    const pick = () => palette[Math.floor(random() * palette.length)];

    /* Les bandes paires et impaires partagent leur rythme : l'œil lit un vrai pagne. */
    const rhythms = [0, 1].map(() => {
        const segments: Segment[] = [];
        let y = 0;

        while (y < height) {
            const h = 28 + Math.floor(random() * 4) * 18;
            const color = pick();
            let alt = pick();

            if (alt === color) {
                alt = palette[(palette.indexOf(color) + 1) % palette.length];
            }

            segments.push({ y, h, kind: Math.floor(random() * 5), color, alt });
            y += h;
        }

        return segments;
    });

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid slice"
            className={cn('h-full w-full', className)}
            aria-hidden
        >
            <defs>
                <pattern
                    id={`grain-${id}`}
                    width="6"
                    height="6"
                    patternUnits="userSpaceOnUse"
                >
                    <rect width="6" height="3" fill="#000" opacity="0.06" />
                    <rect
                        x="0"
                        y="0"
                        width="1"
                        height="6"
                        fill="#fff"
                        opacity="0.05"
                    />
                </pattern>
            </defs>
            {Array.from({ length: strips }, (_, strip) => {
                const x = strip * stripWidth;
                const segments = rhythms[strip % 2];
                const offset = strip % 2 === 0 ? 0 : 18;

                return (
                    <g key={strip} transform={`translate(${x} ${-offset})`}>
                        {segments.map((s, index) => (
                            <Motif key={index} segment={s} w={stripWidth} />
                        ))}
                        <rect
                            x={stripWidth - 1.2}
                            y={0}
                            width={1.2}
                            height={height + offset}
                            fill="#000"
                            opacity="0.18"
                        />
                    </g>
                );
            })}
            <rect width={width} height={height} fill={`url(#grain-${id})`} />
        </svg>
    );
}

function Motif({ segment: s, w }: { segment: Segment; w: number }) {
    const { y, h, color, alt } = s;
    const cx = w / 2;
    const cy = y + h / 2;

    switch (s.kind) {
        /* Rayures de chaîne */
        case 0:
            return (
                <g>
                    <rect y={y} width={w} height={h} fill={color} />
                    {[0.2, 0.42, 0.58, 0.8].map((p) => (
                        <rect
                            key={p}
                            x={w * p - 1.5}
                            y={y}
                            width={3}
                            height={h}
                            fill={alt}
                            opacity="0.9"
                        />
                    ))}
                </g>
            );
        /* Losange */
        case 1:
            return (
                <g>
                    <rect y={y} width={w} height={h} fill={color} />
                    <polygon
                        points={`${cx},${y + 5} ${w - 6},${cy} ${cx},${y + h - 5} 6,${cy}`}
                        fill={alt}
                    />
                    <polygon
                        points={`${cx},${cy - h / 6} ${cx + w / 7},${cy} ${cx},${cy + h / 6} ${cx - w / 7},${cy}`}
                        fill={color}
                    />
                </g>
            );
        /* Damier */
        case 2: {
            const cols = 3;
            const rows = Math.max(2, Math.round(h / 18));
            const cw = w / cols;
            const ch = h / rows;

            return (
                <g>
                    <rect y={y} width={w} height={h} fill={color} />
                    {Array.from({ length: cols * rows }, (_, i) => {
                        const c = i % cols;
                        const r = Math.floor(i / cols);

                        return (c + r) % 2 === 0 ? (
                            <rect
                                key={i}
                                x={c * cw}
                                y={y + r * ch}
                                width={cw}
                                height={ch}
                                fill={alt}
                            />
                        ) : null;
                    })}
                </g>
            );
        }
        /* Chevrons */
        case 3:
            return (
                <g>
                    <rect y={y} width={w} height={h} fill={color} />
                    {Array.from(
                        { length: Math.max(1, Math.floor(h / 16)) },
                        (_, i) => (
                            <polyline
                                key={i}
                                points={`2,${y + 10 + i * 16} ${cx},${y + 2 + i * 16} ${w - 2},${y + 10 + i * 16}`}
                                fill="none"
                                stroke={alt}
                                strokeWidth="4"
                            />
                        ),
                    )}
                </g>
            );
        /* Bloc uni, filet clair */
        default:
            return (
                <g>
                    <rect y={y} width={w} height={h} fill={color} />
                    <rect y={y + h - 4} width={w} height={2} fill={alt} />
                </g>
            );
    }
}
