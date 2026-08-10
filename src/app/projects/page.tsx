import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("프로젝트", "만들어본 프로젝트들을 모아뒀습니다.");

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">프로젝트</h1>
      <p className="mt-3 text-muted">
        만들어본 것들을 모아둡니다.
      </p>

      <ul className="mt-10 flex flex-col gap-4">
        {projects.map((project) => (
          <li key={project.title}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5 hover:border-accent"
            >
              <h2 className="text-lg font-semibold text-foreground">
                {project.title}
              </h2>
              <p className="mt-1.5 text-sm text-muted">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sky px-2.5 py-1 text-xs font-medium text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
