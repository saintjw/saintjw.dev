import { nowSections, nowUpdated } from "@/lib/now";
import { pageMetadata } from "@/lib/metadata";
import {
  DateStamp,
  DiaryPage,
  SheetHeading,
  type TabColor,
} from "@/components/Diary";

export const metadata = pageMetadata(
  "요즘",
  "요즘 쓰고 있는 글, 만들고 있는 것, 준비하는 일을 적어 두는 페이지예요. 한 달에 한 번쯤 고쳐요.",
  "/now",
);

export default function NowPage() {
  return (
    <DiaryPage
      color="leaf"
      title="요즘 하고 있는 일"
      intro={
        <p>
          지금 제 시간을 쓰고 있는 것들을 적어둡니다. 한 달에 한 번쯤 고쳐요.
        </p>
      }
      stamp={
        <p className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <DateStamp date={nowUpdated} color="leaf" />
          <span>에 마지막으로 고쳤어요</span>
        </p>
      }
    >
      <div className="mt-12 flex flex-col gap-12">
        {nowSections.map((section, i) => (
          <section key={section.title}>
            <SheetHeading
              color={(["yellow", "blue", "rose", "leaf"] as TabColor[])[i % 4]}
            >
              {section.title}
            </SheetHeading>
            <ul className="ruled mt-4">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 py-3 leading-relaxed text-foreground/90"
                >
                  <span
                    aria-hidden
                    className="mt-[0.45em] h-3 w-3 shrink-0 rounded-[3px] border-2 border-muted/60"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted">
        이 페이지는{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="marker-link text-foreground"
        >
          /now 페이지
        </a>{" "}
        형식을 따릅니다.
      </p>
    </DiaryPage>
  );
}
