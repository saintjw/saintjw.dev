import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";

export const metadata = pageMetadata(
  "프로젝트",
  "만들어본 프로젝트들을 모아뒀습니다.",
);

export default function ProjectsPage() {
  return (
    <DiaryPage
      color="blue"
      title="프로젝트"
      intro={<p>만들어본 것들을 모아둡니다.</p>}
    >
      <ul className="ruled mt-8 border-t border-dashed border-rule">
        {projects.map((project) => (
          <li key={project.title}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-6"
            >
              <h2 className="text-lg font-bold leading-snug text-foreground">
                <span className="marker-link">{project.title}</span>{" "}
                <span className="text-sm font-normal text-muted">↗</span>
              </h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                {project.description}
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                {project.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            </a>
          </li>
        ))}
      </ul>
    </DiaryPage>
  );
}
