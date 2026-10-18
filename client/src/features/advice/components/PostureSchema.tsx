import { cn } from '@/utils/cn';
import type { PostureTipKey } from '../types/advice.types';

/** Couleurs du dessin (maquettes Figma). */
const LINE = '#6b7d72';
const BODY = '#15803d';
const SIGHT = '#d97706';

/** Place fixe du repère de chaque élément sur le dessin (viewBox 360 × 240). */
const MARKERS: Record<PostureTipKey, [number, number]> = {
  ecran: [338, 50],
  dossier: [50, 100],
  pieds: [196, 206],
  clavier: [146, 86],
  lumiere: [50, 14],
  pauses: [232, 18],
};

/** Zone entourée quand le tuto montre un élément. */
const HIGHLIGHTS: Record<PostureTipKey, [number, number, number, number]> = {
  ecran: [254, 48, 88, 64],
  dossier: [52, 62, 40, 92],
  pieds: [150, 204, 50, 28],
  clavier: [122, 90, 40, 36],
  lumiere: [2, 12, 52, 72],
  pauses: [198, 16, 32, 32],
};

interface PostureSchemaProps {
  /**
   * Réglages affichés, dans l'ordre : le repère n est placé sur le n-ième.
   * Sans liste, le dessin n'a pas de repère.
   */
  markers?: PostureTipKey[];
  /** Élément entouré (étape du tuto). */
  highlight?: PostureTipKey;
  className?: string;
}

/**
 * Dessin du poste de travail : fenêtre, horloge, bureau, écran, clavier,
 * chaise et personne assise. Les numéros sont calculés à partir de l'ordre
 * reçu, jamais stockés : un réglage masqué n'a pas de repère et les suivants
 * sont renumérotés.
 */
export function PostureSchema({
  markers,
  highlight,
  className,
}: PostureSchemaProps) {
  const line = { stroke: LINE, strokeLinecap: 'round' as const };
  const body = {
    stroke: BODY,
    strokeWidth: 4,
    strokeLinecap: 'round' as const,
  };
  return (
    <svg
      viewBox="0 0 360 240"
      role="img"
      aria-label="Schéma du poste de travail"
      className={cn('h-auto w-full', className)}
    >
      {/* Fenêtre */}
      <rect
        x="8"
        y="18"
        width="40"
        height="60"
        rx="3"
        fill="#f0fdf4"
        stroke={LINE}
        strokeWidth="2"
      />
      <line x1="28" y1="18" x2="28" y2="78" {...line} strokeWidth="2" />
      <line x1="8" y1="48" x2="48" y2="48" {...line} strokeWidth="2" />
      {/* Horloge */}
      <circle
        cx="214"
        cy="32"
        r="12"
        fill="#fff"
        stroke={LINE}
        strokeWidth="2"
      />
      <line x1="214" y1="32" x2="214" y2="24" {...line} strokeWidth="2" />
      <line x1="214" y1="32" x2="220" y2="35" {...line} strokeWidth="2" />
      {/* Sol, bureau, écran, clavier */}
      <line x1="10" y1="226" x2="350" y2="226" {...line} strokeWidth="2" />
      <rect x="172" y="120" width="170" height="7" rx="2" fill={LINE} />
      <line x1="182" y1="127" x2="182" y2="226" {...line} strokeWidth="3" />
      <line x1="332" y1="127" x2="332" y2="226" {...line} strokeWidth="3" />
      <rect
        x="262"
        y="56"
        width="72"
        height="48"
        rx="4"
        fill="#fff"
        stroke={LINE}
        strokeWidth="3"
      />
      <line x1="298" y1="104" x2="298" y2="120" {...line} strokeWidth="3" />
      <line x1="284" y1="120" x2="312" y2="120" {...line} strokeWidth="3" />
      <rect x="206" y="114" width="42" height="6" rx="2" fill={LINE} />
      {/* Regard vers l'écran */}
      <line
        x1="132"
        y1="52"
        x2="262"
        y2="62"
        stroke={SIGHT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 5"
      />
      {/* Chaise */}
      <rect x="70" y="140" width="72" height="8" rx="3" fill={LINE} />
      <path
        d="M74 140 Q62 110 70 70"
        fill="none"
        stroke={LINE}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line x1="106" y1="148" x2="106" y2="206" {...line} strokeWidth="4" />
      <line x1="82" y1="208" x2="130" y2="208" {...line} strokeWidth="4" />
      {/* Personne */}
      <circle
        cx="118"
        cy="50"
        r="14"
        fill="#fff"
        stroke={BODY}
        strokeWidth="4"
      />
      <line x1="114" y1="64" x2="102" y2="136" {...body} />
      <line x1="108" y1="80" x2="140" y2="108" {...body} />
      <line x1="140" y1="108" x2="206" y2="112" {...body} />
      <line x1="102" y1="136" x2="166" y2="140" {...body} />
      <line x1="166" y1="140" x2="166" y2="222" {...body} />
      <line x1="166" y1="222" x2="188" y2="222" {...body} />

      {highlight && (
        <rect
          x={HIGHLIGHTS[highlight][0]}
          y={HIGHLIGHTS[highlight][1]}
          width={HIGHLIGHTS[highlight][2]}
          height={HIGHLIGHTS[highlight][3]}
          rx="8"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeDasharray="6 5"
        />
      )}
      {markers?.map((key, index) => {
        const [x, y] = MARKERS[key];
        return (
          <g key={key}>
            <circle cx={x} cy={y} r="11" fill="var(--primary)" />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="12"
              fontWeight="600"
              fill="var(--primary-foreground)"
            >
              {index + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
