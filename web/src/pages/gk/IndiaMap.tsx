import { INDIA_PROJECTION, INDIA_SHAPES, INDIA_VIEWBOX } from "../../gk/indiaMap";
import { REGIONS } from "../../gk/data";

// Soft, distinct colours for the states so neighbours are easy to tell apart;
// Union Territories get their own warm tan.
const STATE_HUES = [205, 140, 35, 280, 170, 350, 60, 235];
const fillFor = (index: number, kind: "state" | "ut", selected: boolean) =>
  kind === "ut" ? `hsl(30 ${selected ? 70 : 45}% ${selected ? 55 : 76}%)` : `hsl(${STATE_HUES[index % STATE_HUES.length]} ${selected ? 70 : 55}% ${selected ? 52 : 78}%)`;

// Tiny places can't fit their number inside, and in a few clusters the
// numbers would sit on top of each other. Those get their number in empty
// space nearby (as [longitude, latitude]) with a thin line back to the place.
const MARKER_AT: Record<string, [number, number]> = {
  Chandigarh: [70.3, 31.6],
  Delhi: [83.0, 29.4],
  Goa: [71.2, 15.0],
  "Dadra and Nagar Haveli and Daman and Diu": [70.4, 20.4],
  Puducherry: [83.0, 11.4],
  Sikkim: [88.4, 29.3],
  Tripura: [90.4, 22.6],
  Mizoram: [94.2, 22.4],
  Manipur: [95.0, 24.2],
  Nagaland: [95.6, 26.2],
  Haryana: [75.7, 29.3],
};

interface Props {
  selected: string | null;
  onSelect: (shape: string) => void;
  showCapitals: boolean;
}

export default function IndiaMap({ selected, onSelect, showCapitals }: Props) {
  const [x, y, w, h] = INDIA_VIEWBOX;
  const shapeByName = new Map(INDIA_SHAPES.map((s) => [s.name, s]));

  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-label="Map of India with its states and Union Territories" className="h-auto w-full select-none">
      {/* Draw the selected region last so its outline isn't hidden by neighbours. */}
      {[...REGIONS.entries()]
        .sort(([, a], [, b]) => Number(a.shape === selected) - Number(b.shape === selected))
        .map(([i, r]) => {
          const shape = shapeByName.get(r.shape);
          if (!shape) return null;
          const on = r.shape === selected;
          return (
            <path
              key={r.shape}
              d={shape.d}
              fill={fillFor(i, r.kind, on)}
              stroke={on ? "#1f2937" : "var(--background)"}
              strokeWidth={on ? 0.16 : 0.07}
              strokeLinejoin="round"
              className="cursor-pointer outline-none transition-colors"
              role="button"
              tabIndex={0}
              aria-label={`${i + 1}. ${r.name}`}
              onClick={() => onSelect(r.shape)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(r.shape))}
            />
          );
        })}

      {showCapitals &&
        REGIONS.map((r) => (
          <circle key={`cap-${r.shape}`} cx={r.lon * INDIA_PROJECTION.kx} cy={-r.lat} r={0.2} fill="#dc2626" stroke="#fff" strokeWidth={0.06} pointerEvents="none" />
        ))}

      {/* Number markers: tap one, or find the number in the list below. */}
      {REGIONS.map((r, i) => {
        const shape = shapeByName.get(r.shape);
        if (!shape) return null;
        const away = MARKER_AT[r.shape];
        const at = away ? [away[0] * INDIA_PROJECTION.kx, -away[1]] : shape.label;
        const on = r.shape === selected;
        return (
          <g key={r.shape} pointerEvents="none">
            {away && <line x1={shape.label[0]} y1={shape.label[1]} x2={at[0]} y2={at[1]} stroke="#9ca3af" strokeWidth={0.07} />}
            {away && <circle cx={shape.label[0]} cy={shape.label[1]} r={0.1} fill="#1f2937" />}
            <g transform={`translate(${at[0]} ${at[1]})`}>
              <circle r={0.46} fill={on ? "#1f2937" : "rgba(255,255,255,0.92)"} stroke="#1f2937" strokeWidth={0.05} />
              <text textAnchor="middle" dominantBaseline="central" fontSize={i + 1 >= 10 ? 0.44 : 0.52} fontWeight={700} fill={on ? "#fff" : "#1f2937"}>
                {i + 1}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
