import type { TocItem } from "@/lib/posts";

/**
 * 글머리의 "이 글의 차례". 큰 제목(H2)만 01, 02 번호와 함께 줄 세운다.
 * 번호는 주제 색으로 찍고(노란 주제는 도장용 진한 노랑), 큰 제목이 3개 이상일 때만 보인다.
 */
export default function PostToc({
  items,
  numberColor,
}: {
  items: TocItem[];
  numberColor: string;
}) {
  const sections = items.filter((t) => t.depth === 2);
  if (sections.length < 3) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className="border-b border-dashed border-rule py-7"
    >
      <p
        id="toc-heading"
        className="text-xs font-semibold tracking-[0.12em] text-muted"
      >
        이 글의 차례
      </p>
      <ol className="mt-3 gap-x-10 sm:columns-2">
        {sections.map((t, i) => (
          <li key={t.id} className="break-inside-avoid">
            <a
              href={`#${t.id}`}
              className="group flex items-baseline gap-3 py-1.5"
            >
              <span
                aria-hidden
                className="tabular w-6 shrink-0 text-sm font-bold"
                style={{ color: numberColor }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] font-medium leading-snug text-foreground">
                <span className="marker-link">{t.text}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
