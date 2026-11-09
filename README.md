# Weekly AI News

Archive of the AI Research & Engineering Digest, with one Markdown file per report.

**[Read the website →](https://zhuogang.github.io/weekly_ai_news/)**

The reading site includes the latest complete issue, a searchable archive, full report pages, section navigation, and clearly labeled partial reports. Markdown files below remain the canonical originals.

## Reports

| Report date | File | Archive status |
| --- | --- | --- |
| 2026-10-28 | [October 28](reports/2026/2026-10-28.partial.md) | Partial: begins inside item 3; introduction and items 1–2 are unavailable |
| 2026-11-01 | [November 1](reports/2026/2026-11-01.md) | Complete text |
| 2026-11-04 | [November 4](reports/2026/2026-11-04.md) | Complete text |
| 2026-11-08 | [November 8](reports/2026/2026-11-08.md) | Complete text |

The historical backfill is **incomplete**. Earlier reports need their original conversation text before they can be archived faithfully. No reconstructed summaries or empty report placeholders are included.

## Format

- Complete reports use `reports/YYYY/YYYY-MM-DD.md`, dated by the report's original date.
- Incomplete recovered excerpts use `YYYY-MM-DD.partial.md` and identify the missing text explicitly.
- Preserve each report's original wording, technical details, caveats, reading recommendations, experiments, and explicit source URLs.
- ChatGPT-only citation widgets are omitted because they do not resolve on GitHub. Existing Markdown source links are retained. Mathematical display delimiters are normalized for GitHub.
- Archived reports preserve the claims made at the time of writing; archiving does not revalidate or update them.

## Ongoing archive

Save every new digest here, update the report index, and commit the report to `main`. Check for an existing file before writing to avoid duplicate reports.

## Website publishing

GitHub Pages serves the generated `docs/` directory from `main`. In **Settings → Pages**, select **Deploy from a branch**, then **main** and **/docs**. This one-time setting requires repository administration access. Subsequent commits to that source publish automatically.

After adding or correcting a report, rebuild the website in the same commit:

```sh
npm ci --ignore-scripts
npm run build
npm run check
```

Commit the report, README index, and generated `docs/` together. The builder discovers dated Markdown reports automatically; no manual website index is needed. It preserves the source files, renders equations as native MathML, and keeps partial archives distinct from complete issues. Search covers dates, section headings, and opening highlights. The site uses no analytics, remote fonts, or runtime CDN dependencies.

Edit presentation in `site/assets/` and generation logic in `scripts/build-site.mjs`, then rebuild. `docs/` is generated; do not edit it by hand. A local preview can be served with `python -m http.server 8000 --directory docs`.
