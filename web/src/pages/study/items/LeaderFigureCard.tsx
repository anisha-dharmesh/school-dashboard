import type { LeaderGridItem } from "../../../study/types";
import { resolveImage } from "../../../study/resolveImage";

export default function LeaderFigureCard({ item }: { item: LeaderGridItem }) {
  return (
    <figure>
      <img src={resolveImage(item.image)} alt={item.caption} />
      <figcaption>{item.caption}</figcaption>
    </figure>
  );
}
