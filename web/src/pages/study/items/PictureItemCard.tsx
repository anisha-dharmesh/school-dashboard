import type { PictureItem } from "../../../study/types";
import { resolveImage } from "../../../study/resolveImage";
import SourceMarks from "../SourceMarks";

export default function PictureItemCard({ item }: { item: PictureItem }) {
  return (
    <figure className="flex flex-col gap-2 py-3">
      <a href={resolveImage(item.image)} target="_blank" rel="noreferrer">
        <img className="max-h-72 w-full max-w-sm rounded-lg border bg-muted/40 object-contain" src={resolveImage(item.image)} alt="" />
      </a>
      <figcaption className="text-sm whitespace-pre-line">
        {item.caption}
        <SourceMarks sources={item.sources} />
      </figcaption>
    </figure>
  );
}
