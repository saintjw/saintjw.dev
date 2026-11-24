// 페이지를 옮길 때마다 새로 그려지는 껍데기. 속지 묶음이 살며시 내려앉는 등장 효과를 건다.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
