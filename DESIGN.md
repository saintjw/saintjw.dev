---
name: saintjw.dev
description: One person's planner. Grid-paper desk, white insert sheets, coloured index tabs for topics.
colors:
  grid-paper: "#fbfaf6"
  grid-paper-alt: "#f4f2ec"
  grid-line: "#dce3ea"
  ink: "#22262b"
  pencil-grey: "#646a72"
  insert-sheet: "#ffffff"
  sheet-edge: "#e2e1da"
  ruled-line: "#e9e7df"
  fountain-blue: "#4c7bd9"
  fountain-blue-deep: "#2f5fbf"
  marker-wash: "#fff0c2"
  highlighter-yellow: "#ffe48a"
  tab-yellow: "#f2b544"
  tab-leaf: "#8fc17a"
  tab-blue: "#3f6fd0"
  tab-rose: "#ee9a9a"
  stamp-ochre: "#c98a12"
  note-mint: "#e1f0d8"
  note-peach: "#fde9c2"
  note-sky: "#dce7fa"
  note-pink: "#fbe0e0"
  lamp-paper: "#1b1e24"
  lamp-paper-alt: "#171a1f"
  lamp-grid: "#272c34"
  lamp-ink: "#e9e6de"
  lamp-pencil: "#a5abb4"
  lamp-sheet: "#23272e"
  lamp-sheet-edge: "#353b45"
  lamp-ruled-line: "#2e333c"
  lamp-blue: "#7c9fe6"
  lamp-blue-light: "#9db8f0"
  lamp-marker-wash: "#3d3622"
  lamp-highlighter: "#6b5a22"
  lamp-tab-yellow: "#d9a43c"
  lamp-tab-leaf: "#7eaa6a"
  lamp-tab-rose: "#d98a8a"
typography:
  display:
    fontFamily: "Gowun Dodum, Pretendard Variable, Malgun Gothic, sans-serif"
    fontSize: "3.4rem"
    fontWeight: 400
    lineHeight: 1.22
  headline:
    fontFamily: "Pretendard Variable, Pretendard, Apple SD Gothic Neo, Malgun Gothic, system-ui, sans-serif"
    fontSize: "2.4rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  sheet-heading:
    fontFamily: "Gowun Dodum, Pretendard Variable, Malgun Gothic, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 400
    lineHeight: 1.33
  title:
    fontFamily: "Pretendard Variable, Pretendard, Apple SD Gothic Neo, Malgun Gothic, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Pretendard Variable, Pretendard, Apple SD Gothic Neo, Malgun Gothic, system-ui, sans-serif"
    fontSize: "1.075rem"
    fontWeight: 400
    lineHeight: 1.8
  body:
    fontFamily: "Pretendard Variable, Pretendard, Apple SD Gothic Neo, Malgun Gothic, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "Pretendard Variable, Pretendard, Apple SD Gothic Neo, Malgun Gothic, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
  stamp:
    fontFamily: "Pretendard Variable, Pretendard, Apple SD Gothic Neo, Malgun Gothic, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.02em"
    fontFeature: "\"tnum\" 1"
rounded:
  binding: "4px"
  sheet-edge: "16px"
  stamp: "8px"
  tab: "8px"
  note-curl: "14px"
  figure: "12px"
  pill: "9999px"
spacing:
  grid: "24px"
  sheet-x-phone: "20px"
  sheet-x-tablet: "48px"
  sheet-x-desktop: "64px"
  sheet-top: "56px"
  section-gap: "64px"
  list-row: "24px"
components:
  sheet:
    backgroundColor: "{colors.insert-sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet-edge}"
    padding: "56px 64px 48px"
  index-tab:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tab}"
    padding: "6px 14px"
  index-tab-active:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tab}"
    padding: "10px 14px 8px"
  index-tab-blue:
    backgroundColor: "{colors.tab-blue}"
    textColor: "{colors.insert-sheet}"
    rounded: "{rounded.tab}"
  date-stamp:
    textColor: "{colors.tab-blue}"
    typography: "{typography.stamp}"
    rounded: "{rounded.stamp}"
    padding: "0.3em 0.8em"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.grid-paper}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.marker-wash}"
    textColor: "{colors.ink}"
  sticky-note:
    backgroundColor: "{colors.note-peach}"
    textColor: "{colors.ink}"
    rounded: "{rounded.note-curl}"
    padding: "20px 20px 16px"
  icon-button:
    textColor: "{colors.pencil-grey}"
    rounded: "{rounded.pill}"
    size: "36px"
  icon-button-hover:
    backgroundColor: "{colors.marker-wash}"
    textColor: "{colors.ink}"
---

# Design System: saintjw.dev

## Overview

**Creative North Star: "The Planner on the Desk"**

The site is one person's planner lying open on a desk. The ground is faint blue-grey grid paper; every page of content is a white insert sheet bound on its left edge, with a second sheet peeking out beneath it. Topics are not chips or filters but coloured index tabs that stick out from the sheet's right edge, and every dated thing carries a slightly crooked rubber stamp. Washi tape holds the sheets down, links get a highlighter swipe, and small extras live on sticky notes. At night it is the same planner under a desk lamp: navy-ink paper, the tabs dimmed but still recognisable.

Reading comes first. The sheet is a calm white column of about 860px (56rem) on article and list pages, Pretendard at a long-read line height (1.85), and the decoration stays on the sheet's edges (tape, tabs, stamp) rather than inside the text. The handwritten voice belongs to Gowun Dodum and is reserved for the logo, the home hero sentence and section headings on sheets; article titles stay in heavy Pretendard so a search reader gets the answer's title in a plain, legible face.

The world refuses the generic centered blog column with category chips and card grids: topics are tabs on the page edge, lists are ruled lines on a sheet, and a post is a dated page, not a card.

**Key Characteristics:**
- 24px grid-paper ground under everything; white insert sheets on top with a stacked-sheet shadow.
- Four tab colours (yellow, leaf, blue, rose) carry topic identity at full saturation; ink is the default text everywhere else.
- Dated, rotated rubber stamps; translucent washi tape strips; highlighter-swipe hover on links.
- Gowun Dodum for the handwritten voice, Pretendard for reading; Korean text always `word-break: keep-all`.
- Light and lamp (dark) modes share every token name; only values change.

## Colors

A paper-and-stationery palette: warm off-white paper and ink, with four saturated stationery colours that only ever mean "topic".

### Primary
- **Fountain Blue** (fountain-blue / lamp-blue): focus outlines and the generic accent; its deeper step (fountain-blue-deep) colours links inside article prose so they read as ink-pen blue against the body.

### Secondary (the index-tab set)
- **Tab Yellow** (tab-yellow): 만들기 기록. Also the default tape colour and the prose blockquote/heading-marker fallback.
- **Tab Leaf** (tab-leaf): AI와 일하기.
- **Tab Blue** (tab-blue): 쉽게 읽는 IT. The only tab whose label flips to white ink in light mode; in lamp mode all tabs use the dark paper colour as label ink.
- **Tab Rose** (tab-rose): non-topic pages (전체, 블로그, personal pages).
- **Stamp Ochre** (stamp-ochre): a darkened yellow used only for date-stamp text on yellow-topic pages, because full Tab Yellow is too light to read as a thin stamp outline on white. It is the CSS token `--stamp-yellow` (#c98a12), with #d9a43c in lamp mode.

### Tertiary (highlighter and sticky notes)
- **Highlighter Yellow** (highlighter-yellow): the link-hover swipe, the static `.marker` phrase in the home hero, and text selection.
- **Marker Wash** (marker-wash): the softer underlay behind bold text in prose, prose blockquotes, and hover fill for secondary buttons and the theme toggle.
- **Note Mint / Peach / Sky / Pink**: sticky-note backgrounds only (home and games). One note per colour, never as panel fills.

### Neutral
- **Grid Paper** (grid-paper) with **Grid Line** (grid-line): the body ground, drawn as 1px lines every 24px.
- **Grid Paper Alt** (grid-paper-alt): code blocks and inline code.
- **Insert Sheet** (insert-sheet): every content sheet.
- **Ink** (ink): headings and primary text. Prose body is ink mixed 86% into the sheet colour for a softer long-read tone.
- **Pencil Grey** (pencil-grey): meta lines, intros, nav links at rest.
- **Sheet Edge** (sheet-edge): sheet borders and the global default border colour.
- **Ruled Line** (ruled-line): dashed dividers between list rows and sections, prose hr.
- The `lamp-*` set is the dark-mode value of each of the above, applied through the `dark` class or `prefers-color-scheme: dark` when no explicit `light` class is set.

### Named Rules
**The Tabs Mean Topics Rule.** The four tab colours identify a topic (or, for rose, "not a topic"). Wherever a page belongs to a topic, its tape, stamp, sheet-heading underlay and prose H2 marker all take that topic's tab colour. Do not use a tab colour decoratively on something that isn't tied to its topic.

**The Ink-Not-Accent Rule.** Primary actions are ink pills, not blue buttons. Blue is for focus and in-text links.

## Typography

**Display Font:** Gowun Dodum (via next/font, weight 400 only; falls back to Pretendard Variable, Malgun Gothic)
**Body Font:** Pretendard Variable (jsDelivr CDN, dynamic subset; falls back to Apple SD Gothic Neo, Malgun Gothic, system-ui)
**Mono Font:** Geist Mono (code only)

**Character:** Gowun Dodum is rounded and pen-like, the owner's handwriting on the page; Pretendard is the clean printed text of the insert. The pairing stays legible on a phone because the handwriting is never used for paragraphs.

### Hierarchy
- **Display** (Gowun 400, 2.15rem phone to 3.4rem sm+, line-height 1.3 to 1.22, balanced): the home hero sentence only.
- **Headline** (Pretendard 800, 1.75rem phone to 2.4rem sm+, 1.3, -0.02em, balanced): article H1.
- **Sheet heading** (Gowun 400, 1.5rem to 1.7rem): the H1 of list/personal pages and section headings on sheets, with a translucent tab-coloured strip behind the lower half of the words. Prose H2 inside articles also switches to Gowun with a small rotated tab-coloured square before it.
- **Title** (Pretendard 700, 1.1 to 1.125rem, snug, -0.01em): post titles in ruled lists and previous/next page links.
- **Lead** (Pretendard 400, 1.075rem to 1.125rem, 1.8, pencil grey): article description under the meta line; intros on sheets use body size with relaxed leading.
- **Body** (Pretendard 400, prose-lg 1.125rem, line-height 1.85): article text, full sheet width inside sheet padding.
- **Label** (Pretendard 600, 13px phone / 14px sm+): index-tab labels; tab counts at 12px with tabular figures.
- **Stamp** (Pretendard 700, 14px, tabular, 0.02em): date stamps; weekday in 12px.

### Named Rules
**The Handwriting Is For Headings Rule.** Gowun Dodum appears only at 1.25rem and above (logo, hero, sheet headings, prose H2, sticky-note titles). Never set paragraphs, meta, or labels in it.

**The Keep-All Rule.** All Korean text uses `word-break: keep-all`; headings additionally use balanced wrapping.

## Layout

The page is a single centered column on the grid ground. Article, post-list and personal pages use a 56rem (about 896px) wrapper; home and wide pages use 64rem (max-w-5xl). Side gutters are 12px on phones and 24px from sm up. When a sheet has index tabs, the wrapper adds 64px of right padding at lg so the tabs have room to protrude.

Sheets pad 20px horizontally on phones, 48px at sm, 64px at lg, with 40px top on phones and 56px at sm. Vertical rhythm between stacked sheets and sections on home is 64px. Lists inside sheets are "ruled": rows separated by 1px dashed ruled lines, 20 to 24px row padding, with a 7.5rem date column beside the title column from sm up.

Index tabs are the main responsive change: at lg they stand vertically (vertical-rl writing) off the sheet's right edge, starting 56px from the top; below lg they form a horizontally scrolling row of tabs sitting on top of the sheet's upper edge. Tape position also shifts: top-left of the sheet at lg, a small strip at the bottom-right on phones when tabs occupy the top edge.

The top bar is sticky, 90% grid-paper with a light backdrop blur and a hairline bottom border; it carries the Gowun logo ("saintjw" plus "의 다이어리" from sm), five plain text links and the theme toggle. Ad slots open only when an AdSense client and slot exist, as a band between dashed ruled lines inside the sheet, 40px vertical margin, minimum 250px tall.

## Elevation & Depth

Depth is physical stationery, not UI elevation. There are exactly two shadow families: the insert sheet (a 1px contact shadow plus a long soft drop) and the sticky note (a tighter version that deepens on hover). Each sheet also has a second, identical sheet behind it, offset 7px down-right and rotated 0.5deg, so pages read as a stack. Everything else is flat: tabs, stamps, tape and buttons cast no shadow. In lamp mode the sheet shadow darkens to pure black at higher opacity.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 1px 1px rgba(34,38,43,0.06), 0 14px 32px -18px rgba(34,38,43,0.35)`; lamp: `0 1px 1px rgba(0,0,0,0.3), 0 18px 36px -18px rgba(0,0,0,0.7)`): every insert sheet and the sheet behind it.
- **Note rest** (`box-shadow: 0 1px 1px rgba(34,38,43,0.08), 0 10px 18px -12px rgba(34,38,43,0.45)`): sticky notes.
- **Note lifted** (`box-shadow: 0 1px 1px rgba(34,38,43,0.08), 0 16px 24px -12px rgba(34,38,43,0.45)`): sticky note on hover/focus, paired with straightening and a 3px lift.

### Named Rules
**The Paper Only Rule.** Only paper objects (sheets, notes) cast shadows. Controls stay flat.

## Shapes

Shapes come from stationery. The insert sheet is bound on the left: 4px corners on the left, 16px on the right. Sticky notes are square except for one curled corner (2px, 2px, 14px bottom-right, 2px); prose blockquotes reuse that curl at 12px. Index tabs are rounded only on the edge that sticks out (top corners when horizontal, right corners when vertical, 8px). Date stamps are 8px-rounded outlined rectangles with a 2px border in the tab colour, rotated -2.5deg. Washi tape is a 116 by 28px strip (smaller on phones) with a torn-edge clip-path, 78% opacity and faint vertical fibres, set at a slight rotation. Actions are full pills; article figures and code blocks are 12px-rounded with a hairline border.

Small rotations (between -3deg and 6deg) are part of the language for tape, stamps, sticky notes and the H2 marker square; sheets themselves are never rotated.

## Components

### Insert Sheet
The base surface for every page. White (lamp: navy sheet), sheet-edge border, binding-left radius, sheet shadow, a second sheet behind it. Holds tape, an optional stamp, a sheet heading or article header, then content. Parent of index tabs.

### Index Tabs
Topic navigation that protrudes from the sheet. Full tab colour fill with ink label (white on blue in light mode). At rest a tab sits slightly tucked in (90% opacity, shifted 4px into the sheet at lg); hover and focus slide it out (more padding, full opacity, 4px outward). The active tab (`aria-current="page"`) sits proud and wider (48px vs 40px at lg). Transitions are 0.3s with `cubic-bezier(0.22, 1, 0.36, 1)`; disabled under reduced motion. Below lg, tabs scroll horizontally and show post counts.

### Date Stamp
A rotated rubber stamp: outlined in the topic's tab colour (stamp ochre for yellow), bold tabular date, small weekday. Full form "2026. 11. 15 일" in headers, short form "11. 15 일" in list rows.

### Washi Tape
Purely decorative, `aria-hidden`, pointer-events off. One or two per sheet in the topic colour. Never carries text.

### Highlighter Link
The site-wide link hover: a highlighter band (from 60% to 94% of the line height) sweeps in from left to right over 0.35s. Used on nav, footer, list titles (triggered by the whole row as a group) and prose links. The static `.marker` version highlights one phrase in the home hero.

### Buttons
- **Shape:** full pill.
- **Primary:** ink background, paper-coloured text, 600 weight 14px, 12px by 24px padding; hover lifts 2px.
- **Secondary:** transparent with an ink border at 25% opacity; hover makes the border full ink and fills with marker wash.
- **Icon (theme toggle):** 36px circle, pencil-grey 18px line icon (1.8 stroke); hover fills marker wash and turns ink.

### Sticky Notes
Links to games, now, projects and uses. Each a different note colour with its own fixed tilt (about -1.6 to 1.8deg); hover/focus straightens it, lifts it 3px and deepens the shadow. Title in Gowun at 1.25rem, body in 14px Pretendard at 80% ink, a highlighter-link call to action at the bottom.

### Navigation
Sticky top bar: Gowun logo left, plain 14 to 15px pencil-grey text links that turn ink with a highlighter swipe on hover, theme toggle at the right. Hidden link row in standalone (installed PWA) display mode. Footer repeats the logo voice with secondary links in the same style. Previous/next at the end of an article are "← 앞 장" / "다음 장 →" between dashed ruled lines.

### Article Contents (이 글의 차례)
Shown under the article header when the post has three or more H2 sections. A small tracked "이 글의 차례" label, then the H2 titles in one or two newspaper-style columns (top to bottom, then the second column), each led by a bold tabular "01, 02" number in the topic ink (stamp ochre for yellow). Closed by a dashed ruled line; titles take the highlighter hover. H2 and H3 headings get stable ids generated from their text (Korean kept, spaces to hyphens) so sections can be linked.

### Reading Progress
A 3px band fixed to the very top of article pages, in the topic's tab colour, that grows left to right with scroll. Decorative (`aria-hidden`), no transition so it never lags.

### Divider Tabs (잡학사전 filter)
For filtering a list inside a sheet (not topic navigation on the sheet edge): binder-divider tabs standing on a 2px ink line. The chosen tab is full tab colour and raised; the others are the same colour washed 32% into the sheet with ink labels, and rise on hover. Each shows a tabular count. Below them sits a ruled-line search field: a magnifier icon and a borderless input over a dashed rule that turns solid ink on focus instead of a focus box. The choice is mirrored in the URL hash.

### Keycap Start Button (games)
The game "start" control is an ink pill standing on a 3px darker bottom edge (a border, not a shadow); it rises 1px when its card is hovered and sinks 2px, losing the edge, when pressed. Game icons wiggle once on card hover. Both are off under reduced motion.

### Article Prose
Typography plugin re-coloured from tokens: softened ink body, Gowun H2 with a tilted topic-colour square that opens each section with a dashed ruled line above it (not on the first heading), highlighter-hover links in deep blue, bold text on a marker-wash underlay, blockquotes as marker-wash notes with a curled corner and no left rule, inline code in a bordered paper-alt chip, full-width figures with a 12px radius and hairline border, centered captions, tabular numbers in tables.

### Game Icons
Hand-drawn-feeling line icons on a 24px viewbox, one stroke weight (1.8), in current text colour.

## Do's and Don'ts

### Do:
- **Do** put every page's content on an insert sheet over the grid ground, with the sheet behind it.
- **Do** colour a topic's tape, stamp, sheet-heading strip and prose H2 marker with that topic's tab colour.
- **Do** show topic navigation as index tabs on the sheet edge, sliding out on hover/focus with the 0.3s ease-out curve.
- **Do** date things with the rotated stamp, in the "2026. 11. 15 일" form.
- **Do** use the highlighter swipe for link hover, and respect `prefers-reduced-motion` for every transition.
- **Do** keep primary actions as ink pills and blue for focus rings and in-text links.
- **Do** define every new colour as a light token plus its lamp-mode value under the same name.

### Don't:
- **Don't** render topics as pill chips or categories as a card grid; that is the generic blog column this world replaced.
- **Don't** set paragraphs, meta or labels in Gowun Dodum.
- **Don't** use a tab colour as a decorative fill unrelated to its topic, or add a fifth tab colour without a new topic.
- **Don't** give controls (tabs, buttons, stamps) shadows; only sheets and notes are paper.
- **Don't** rotate a sheet or the reading column; tilt belongs to tape, stamps, notes and markers.
- **Don't** put text on washi tape.
