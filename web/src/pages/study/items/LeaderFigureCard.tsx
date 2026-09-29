import type { LeaderGridItem } from "../../../study/types";
import { resolveImage } from "../../../study/resolveImage";

export default function LeaderFigureCard({ item }: { item: LeaderGridItem }) {
  return (
    <figure className="m-0 text-center">
      <img className="aspect-square w-full rounded-lg border object-cover" src={resolveImage(item.image)} alt={item.caption} />
      <figcaption className="mt-1 text-[11px] font-semibold">{item.caption}</figcaption>
    </figure>
  );
}
