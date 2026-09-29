import type { PictureItem } from "../../../study/types";
import { resolveImage } from "../../../study/resolveImage";
import SourceMarks from "../SourceMarks";
import styles from "../Study.module.css";

export default function PictureItemCard({ item }: { item: PictureItem }) {
  return (
    <div className={styles.picItem}>
      <a href={resolveImage(item.image)} target="_blank" rel="noreferrer">
        <img src={resolveImage(item.image)} alt="" />
      </a>
      <div className={styles.picCaption}>
        {item.caption}
        <SourceMarks sources={item.sources} />
      </div>
    </div>
  );
}
