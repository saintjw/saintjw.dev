---
title: 사이트에 대표 주소와 구조화 데이터를 붙인 과정
description: 페이지마다 canonical 주소를 지정하고, JSON-LD 구조화 데이터와 사이트맵을 정리하면서 만난 함정과 해결 방법을 기록했습니다.
date: '2026-11-24'
topic: build-log
tags: [Next.js, SEO, canonical, JSON-LD, 사이트맵]
draft: false
---

검색엔진이 사이트를 정확히 이해하도록 세 가지를 손봤습니다. 페이지마다 대표 주소(canonical)를 정하고, 글과 질문에 구조화 데이터(JSON-LD)를 붙이고, 사이트맵에 답변이 달린 공개 질문을 올렸습니다. 이 글에서는 무엇을 왜 바꿨는지, 그리고 코드를 짜면서 신경 쓴 부분을 정리합니다.

![대표 주소, 구조화 데이터, 사이트맵 세 가지를 요약한 그림](/images/posts/canonical-url-and-structured-data-for-seo/seo-summary.png "이번 작업의 세 축")

## 왜 대표 주소가 필요했나

같은 내용이 여러 주소로 열릴 수 있습니다. 예를 들어 주소 뒤에 `?k=...` 같은 매개변수가 붙거나 끝에 슬래시가 있고 없고의 차이만 있어도 검색엔진은 다른 페이지로 볼 수 있습니다. 이때 "이 페이지의 대표 주소는 여기입니다"라고 알려 주는 것이 canonical 링크입니다.

Next.js의 메타데이터 기능에서는 `alternates.canonical`에 경로를 적으면 됩니다. 페이지가 열 개가 넘다 보니 매번 같은 형태를 반복해서 쓰지 않도록 공통 함수를 하나 두었습니다.

```ts
export function pageMetadata(title: string, description: string, path?: string): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    ...(path && { alternates: { canonical: path, types: RSS_ALTERNATE } }),
    openGraph: { title: fullTitle, description, ...(path && { url: path }) },
    twitter: { title: fullTitle, description },
  };
}
```

`path`를 넘기면 canonical과 공유용 주소(Open Graph의 url)가 같은 값으로 들어갑니다. 홈, 글 목록, 게임, 프로젝트, 이야기방, 개인정보 처리방침 같은 페이지는 이 함수에 경로만 한 줄 더 넘기도록 바꿨습니다.

## 하위 페이지가 alternates를 통째로 덮어쓴다

여기서 한 가지 함정이 있었습니다. 이 사이트는 레이아웃에서 RSS 구독 링크를 `alternates`에 넣어 두었습니다. 그런데 하위 페이지가 자기 `alternates`를 정하면 레이아웃의 값과 합쳐지지 않고 통째로 대체됩니다. canonical을 넣은 페이지에서는 RSS 링크가 사라지는 셈입니다.

그래서 RSS 정보를 상수로 빼 두고, canonical을 지정하는 곳마다 함께 넣도록 했습니다. 위 코드의 `types: RSS_ALTERNATE`가 그 부분입니다. 글 상세 페이지도 같은 이유로 `alternates`에 canonical과 RSS를 같이 적었습니다.

![레이아웃의 RSS 링크가 페이지의 canonical에 덮여 사라지는 모습과, 공통 함수로 둘 다 유지하는 모습을 비교한 그림](/images/posts/canonical-url-and-structured-data-for-seo/alternates-override.png "덮어쓰기와 해결")

배운 점은 단순합니다. 메타데이터를 상속받는다고 생각했지만 객체 안쪽까지 병합되지는 않았습니다. 그래서 하위에서 다시 적는 값이 있다면, 상위에서 물려받고 싶은 값도 함께 적어야 합니다.

## 구조화 데이터는 @id로 서로 연결한다

구조화 데이터는 페이지가 무엇인지 검색엔진에 기계가 읽는 형식으로 알려 주는 정보입니다. 여기서는 schema.org 어휘를 JSON-LD로 적었습니다.

먼저 레이아웃에 사이트 전체에 공통인 정보를 넣었습니다. `WebSite`와 운영자를 나타내는 `Person`입니다. 각각 `@id`를 달아 두었고, `WebSite`의 `publisher`는 운영자 `Person`의 `@id`만 가리킵니다.

글 상세 페이지에서는 `BlogPosting`과 `BreadcrumbList`를 넣었습니다. `BlogPosting`의 `author`, `publisher`는 운영자의 `@id`를, `isPartOf`는 `WebSite`의 `@id`를 가리킵니다. 이름과 주소를 글마다 다시 쓰지 않고 한 곳에만 적으니, 나중에 운영자 정보가 바뀌어도 레이아웃 한 군데만 고치면 됩니다.

![WebSite와 Person이 레이아웃에 있고, 글 페이지의 BlogPosting이 @id로 이를 가리키는 관계를 보여 주는 그림](/images/posts/canonical-url-and-structured-data-for-seo/json-ld-graph.png "@id로 연결된 구조")

빵 부스러기(`BreadcrumbList`)는 홈, 탐구노트, 주제, 글 제목 순서로 만듭니다. 글에 주제가 없을 때는 중간 단계를 빼고 위치 번호도 하나 줄입니다.

JSON-LD는 `<script>` 안에 문자열로 넣기 때문에, 데이터 안에 `</script>` 같은 글자가 들어가면 문제가 됩니다. 그래서 출력 컴포넌트에서 `<`를 이스케이프합니다.

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "<") }}
/>
```

글 제목이나 질문 내용처럼 사람이 쓴 문자열이 들어가는 곳이라서, 이 한 줄은 꼭 필요하다고 판단했습니다.

## 공개된 질문만 알린다

이야기방의 질문은 이미 있는 글 `/posts/qna-board-without-login`에서 다뤘듯이 로그인 없이 받습니다. 그중 답변이 달렸고 비공개가 아닌 질문만 누구나 볼 수 있습니다. 이 조건을 `isPublic` 함수로 묶었습니다.

이 조건을 통과한 질문에만 `QAPage` 구조화 데이터를 붙입니다. 질문 본문, 작성 시각, 채택된 답변과 답변 시각이 들어갑니다. 조건을 통과하지 못하는 질문은 구조화 데이터를 내보내지 않고, 메타데이터에서 `noindex`로 표시합니다. 질문 작성자가 자기 링크로 보는 화면까지 검색에 노출되면 안 되기 때문입니다.

![답변 완료와 비공개 아님 두 조건을 모두 만족하면 canonical, QAPage, 사이트맵에 포함되고 아니면 모두 제외되는 흐름을 보여 주는 그림](/images/posts/canonical-url-and-structured-data-for-seo/public-question-gate.png "공개 질문 판정")

## 사이트맵에 질문 올리기

사이트맵은 고정 경로, 공개된 글, 그리고 이번에 더한 공개 질문을 합쳐서 만듭니다. 질문은 저장소에서 읽어 와야 하므로 사이트맵 함수를 비동기로 바꿨습니다.

```ts
export const revalidate = 3600;

try {
  if (isStoreReady()) {
    questions = (await listPublicQuestions()).map((q) => ({
      url: `${BASE_URL}/qna/${q.id}`,
      lastModified: new Date(q.answeredAt ?? q.createdAt),
    }));
  }
} catch {
  // 저장소에 닿지 못해도 사이트맵 전체가 깨지지 않게 질문만 뺀다.
}
```

두 가지를 고려했습니다. 첫째, 새로 답한 질문이 곧 사이트맵에 보이도록 한 시간마다 다시 만들게 했습니다(`revalidate = 3600`). 둘째, 저장소에 연결하지 못하는 상황에서도 사이트맵 전체가 실패하면 글과 페이지 목록까지 잃게 되므로, 질문 부분만 빈 목록으로 두고 나머지는 그대로 내보냅니다.

## 정리

- canonical은 공통 함수로 한 번에 정하되, 하위 페이지의 `alternates`가 상위 값을 덮어쓴다는 점을 기억해야 합니다.
- 구조화 데이터는 `@id`로 연결하면 같은 정보를 반복해서 쓰지 않아도 됩니다.
- 사람이 쓴 문자열이 들어가는 JSON-LD는 `<`를 이스케이프합니다.
- 공개 여부를 한 함수로 판단해 구조화 데이터, 색인 여부, 사이트맵이 같은 기준을 따르게 합니다.

이 설정이 검색 결과에 어떻게 반영되는지는 검색엔진이 다시 수집한 뒤에야 알 수 있습니다. 반영 결과를 확인하면 다시 기록하겠습니다.
