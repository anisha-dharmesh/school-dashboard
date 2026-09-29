import type { QaItem } from "../../../study/types";
import { resolveImage } from "../../../study/resolveImage";
import SourceMarks from "../SourceMarks";
import styles from "../Study.module.css";

/** One question and its answer, as plain text. A list answer renders as bullets. */
export default function QaItemCard({ item }: { item: QaItem }) {
  return (
    <div className={styles.qa}>
      {item.image && <img className={styles.qImage} src={resolveImage(item.image)} alt="" />}
      <p className={styles.q}>
        {item.question}
        <SourceMarks sources={item.sources} />
      </p>
      <div className={styles.a}>
        {Array.isArray(item.answer) ? (
          <ul>
            {item.answer.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          item.answer
        )}
      </div>
    </div>
  );
}
