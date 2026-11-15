# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: readers who arrive from search on a single article (in-site posts under /posts, or Tistory posts linked from /blog), usually on a phone, with no prior idea who saintjw is. They came for one answer; the site wants them to stay for a second piece and to leave knowing a real person wrote it.

Secondary: the owner, who keeps this as a personal archive, and visitors who try the small web games.

## Product Purpose

saintjw.dev is one person's personal site: in-site articles (topics 만들기 기록, AI와 일하기, 쉽게 읽는 IT), an index of the owner's Tistory blog by category (데스크케어, 일상의러닝, 소소한여행, IT전자기기, 부업재테크, 오피스케어 …), small self-made web games, and personal pages (/now, /uses, /projects, /guestbook).

Success, as the owner defined it: a visitor reads an article to the end and continues to another; feels a specific human behind the site; enjoys the games and things the owner made.

## Positioning

Not a publication and not a portfolio: a single person's working desk and weekend, written in plain Korean for non-developers, with the things they built (games, tools, this site) sitting next to the writing.

## Operating Context

- Next.js 16 (App Router) + Tailwind 4 + @tailwindcss/typography, deployed by Vercel on push to master.
- A daily automation adds one post to content/posts/*.md (with 1–3 PNG images in public/images/posts/<slug>/) and publishes it. Post pages must render any new markdown well without manual styling.
- Tistory posts are fetched by RSS; the home and /blog list them by category.
- Giscus comments on posts, a guestbook, game leaderboards.

## Capabilities and Constraints

- Must keep: light/dark theme toggle (stored in localStorage, `light`/`dark` class on html, system default otherwise).
- Must keep: room for Google AdSense on article pages (planned); article layout must absorb ad slots without looking broken.
- Keep existing routes and URLs (SEO); content and functions stay.
- Korean is the primary language; body text uses `word-break: keep-all`.
- The current pastel-purple palette is NOT a brand commitment and may be replaced.

## Brand Commitments

- Name: saintjw / saintjw.dev.
- Voice: first-person, warm, plain Korean, 존댓말 in site copy ("…모아둡니다", "…고쳐요").
- All posts are the owner's own writing; the site never describes posts as automated or AI-written.

## Evidence on Hand

- Real posts in content/posts/ with their own PNG figures.
- Real Tistory categories and post counts via RSS.
- Four playable games (/games), real leaderboards.
- No photos of the owner, no testimonials, no follower numbers; do not fabricate any.

## Product Principles

1. Reading comes first: an article page must be comfortable for a long read on a phone.
2. A person, not a brand: every surface should carry traces of one specific human (dates, handwriting-like notes, what they're doing now).
3. One more piece: every page offers a natural next thing to read or play.
4. Never fake: no invented stats, quotes or claims.
