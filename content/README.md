# 사이트 글 쓰는 법

글은 `content/posts/<slug>.md` 파일 하나가 한 편입니다.

- 파일 이름(slug)은 영문 소문자, 숫자, 하이픈만 씁니다. 주소가 됩니다.
  예) `content/posts/tistory-category-grouping.md` → `/posts/tistory-category-grouping`
- 맨 위 frontmatter에 아래 항목을 적습니다. 빠지거나 형식이 틀리면 빌드가 실패해서 바로 알 수 있어요.

```markdown
---
title: "글 제목"
description: "목록과 검색 결과에 보일 한두 문장 요약"
date: 2026-11-08          # 처음 공개한 날 (YYYY-MM-DD)
updated: 2026-11-10       # (선택) 크게 고친 날
topic: build-log          # build-log | ai-work | tech-explained (src/lib/topics.ts)
tags: ["Next.js", "티스토리"]
draft: true               # true면 배포된 사이트에는 안 보이고 `npm run dev`에서만 보임
---

본문은 마크다운으로 씁니다. 이미지는 public/posts/ 에 넣고 ![설명](/posts/파일.png) 로 씁니다.
```

## 공개하는 순서

1. `npm run dev`로 띄우고 `http://localhost:3000/posts`에서 초안을 읽어봅니다.
2. 고칠 곳을 고친 뒤 `draft: true`를 `draft: false`로 바꿉니다.
3. 커밋하고 push하면 Vercel에 배포됩니다.

## 좋은 글의 기준 (애드센스 심사를 생각하면)

- 직접 해 본 것, 직접 겪은 문제, 직접 내린 판단이 들어갈 것
- 사실·수치에는 출처를 달 것
- 다른 글을 짜깁기하지 말 것. 같은 주제라도 내 경험이나 관점이 있어야 함
