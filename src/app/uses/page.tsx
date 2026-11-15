import { usesGroups } from "@/lib/uses";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading, type TabColor } from "@/components/Diary";

export const metadata = pageMetadata(
  "쓰는 것들",
  "매일 쓰는 기기와 도구, 서비스를 모아둡니다.",
);

export default function UsesPage() {
  return (
    <DiaryPage
      color="rose"
      title="쓰는 것들"
      intro={
        <p>글을 쓰고 이 사이트를 만드는 데 매일 쓰는 기기와 도구들이에요.</p>
      }
    >
      <div className="mt-12 flex flex-col gap-12">
        {usesGroups.map((group, i) => (
          <section key={group.title}>
            <SheetHeading
              color={(["blue", "yellow", "leaf", "rose"] as TabColor[])[i % 4]}
            >
              {group.title}
            </SheetHeading>
            <dl className="ruled mt-4">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
                >
                  <dt className="font-semibold text-foreground">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="marker-link"
                      >
                        {item.name} <span className="text-muted">↗</span>
                      </a>
                    ) : (
                      item.name
                    )}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted sm:text-[15px]">
                    {item.note}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted">
        다른 사람들의 /uses 페이지는{" "}
        <a
          href="https://uses.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="marker-link text-foreground"
        >
          uses.tech
        </a>
        에서 볼 수 있어요.
      </p>
    </DiaryPage>
  );
}
