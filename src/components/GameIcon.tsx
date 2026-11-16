// 게임 목록의 손그림 같은 아이콘. 한 가지 선 굵기(1.8)와 잉크색으로 통일한다.
const paths: Record<string, React.ReactNode> = {
  "tic-tac-toe": (
    <>
      <circle cx="7" cy="12" r="4.2" />
      <path d="M14 7.8l6.4 8.4M20.4 7.8 14 16.2" />
    </>
  ),
  "reaction-time": (
    <>
      <path d="M13.5 2.8 5.5 13.2h5.6l-1 8 8-10.6h-5.6l1-7.8Z" />
    </>
  ),
  "whack-a-mole": (
    <>
      <path d="M2.5 20c2.2-1.8 16.8-1.8 19 0" />
      <path d="M6.5 18.6V13a5.5 5.5 0 0 1 11 0v5.6" />
      <circle cx="10" cy="12" r=".9" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12" r=".9" fill="currentColor" stroke="none" />
      <path d="M11 15h2" />
    </>
  ),
  "sky-fighter": (
    <>
      <path d="M12 2.8c1.2 1.3 1.6 3 1.6 4.8v3.6l6.4 4v2l-6.4-2v3.3l2 1.6v1.4L12 20.6l-3.6.9v-1.4l2-1.6v-3.3l-6.4 2v-2l6.4-4V7.6c0-1.8.4-3.5 1.6-4.8Z" />
    </>
  ),
  sudoku: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17" />
    </>
  ),
  "memory-match": (
    <>
      <rect x="3" y="5.5" width="10" height="14" rx="1.8" transform="rotate(-8 8 12.5)" />
      <rect x="11" y="4.5" width="10" height="14" rx="1.8" transform="rotate(8 16 11.5)" />
      <path d="m16 9 .8 1.7 1.8.2-1.3 1.2.4 1.8-1.7-.9-1.6.9.3-1.8-1.3-1.2 1.8-.2Z" />
    </>
  ),
  "chosung-quiz": (
    <>
      <path d="M3.5 6.5h6.5v7" />
      <path d="M13.5 6v9.5h7V6M13.5 10.7h7" />
      <path d="M4 19h16" />
    </>
  ),
};

export default function GameIcon({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const icon = paths[slug];
  if (!icon) return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="36"
      height="36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icon}
    </svg>
  );
}
