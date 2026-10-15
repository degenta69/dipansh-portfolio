# Design Goals

These principles guide changes to the site.

## Easy to fork

A new contributor should be able to clone the repository, start the site, and
find the main content without learning the internals of Next.js. Fork-specific
settings should be documented, searchable, and kept in as few places as
practical.

## Fast by default

The production site is a static export, so routes must remain statically
renderable. Keep client-side JavaScript and third-party code modest. Measure
performance before adding complexity intended to improve it.

## Easy to change

- Keep components and data files focused.
- Put similar features in similar places.
- Prefer readable code over clever abstractions.
- Automate formatting and routine checks.
- Remove dead code and stale documentation.
- Add a dependency when it is maintained and clearly cheaper than owning the
  equivalent code.

## Stable for forks

Prefer mature tools, explicit types, and repeatable builds. Test published
content, metadata, accessibility-sensitive behavior, and static deployment.
When a change affects fork configuration or public routes, document the
migration.

## Visual design

The visual system is deep teal on warm paper. Light paper is `#F6F2E9`, raised
surfaces `#FBF9F4`, ink `#23262B`, muted text `#575B63`, teal `#0B5D5E`. Amber
text is `#7A5600` and amber marks are `#A27500`. Dark paper is `#16181B`,
surfaces `#1E2125`, ink `#ECE7DC`, muted `#A9A69F`, teal `#5FC4BE`.

IBM Plex Sans handles headings, navigation, and buttons. Source Serif 4 handles
prose. JetBrains Mono identifies dates, data, and annotations. All three are
self-hosted. Flat surfaces, hairlines, and spacing keep the composition crisp.
The homepage is paper, not a poster: the headline and introduction share the
left column, and a monogram stands in for a future portrait on the right.

Teal handles links and filled controls. Amber is reserved for draft and
in-progress marks, and amber text must clear the text contrast floor. New
surface colours must retain readable text and links in both themes, and print
resets them to ink on paper.

The implementation lives in [`app/styles/tokens/`](../app/styles/tokens/).

## References

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Rules of React](https://react.dev/reference/rules)
