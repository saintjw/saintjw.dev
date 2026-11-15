---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/posts/[slug]/page.tsx","src/app/posts/page.tsx","src/app/layout.tsx"]
---

# Surface brief: whole site (home, /posts, /posts/[slug], shared frame)

Mode: read (articles are where search readers land); home is the diary's first page inside the same world.
Audience/job: a search reader on a phone reads one article, then a second; feels one specific person behind it. Keep theme toggle, AdSense room, all routes.

## Direction contract

THESIS: The site is one person's planner. Topics are the coloured index tabs on the page edge, every post is a dated insert page, home is today's page. Refuses the category-default centered blog column with chips and cards.

OWN-WORLD: Faint blue-grey 24px grid paper ground (#FBFAF6 / grid #DCE3EA), white insert sheets bound on the left (small left radius, large right radius) sitting on a soft stacked-sheet shadow; ink #22262B. Index-tab colours carry topic identity at full saturation: yellow #F2B544 (만들기 기록), leaf #8FC17A (AI와 일하기), blue #4C7BD9 (쉽게 읽는 IT), rose #EE9A9A (personal pages). Rotated rubber date stamps in the tab colour, translucent washi tape strips holding sheets. Gowun Dodum for display voice, Pretendard for reading. Night mode: the same planner under a desk lamp, navy-ink paper #1B1E24.

STORY: Visitor sees a dated page by a person, reads in a calm white column, follows tabs to more pages of the same topic, and turns to the previous/next page at the end.

FIRST VIEWPORT: Post page: top bar with handwritten-voice logo and plain nav; centered white sheet (~860px) with washi tape at top-left, date stamp, H1, meta line, lead; topic tabs protrude from the sheet's right edge (horizontal row above the sheet on phones). Home: today's sheet with date stamp, the hero sentence, and tabs leading to topics.

FORM: chosen card IMPECCABLE'S PICK (grounded #1 of 7, "다이어리 속지"); seed:07862c850afbefbc. Signature interaction: index tabs slide out on hover/focus and the active tab sits proud; link hover draws a highlighter swipe. Motion grammar: short ease-out slides, reduced-motion respected.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
