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

GitHub Actions builds and publishes the reading site using [`pages.yml`](.github/workflows/pages.yml). Every push to `main` installs locked dependencies with Node.js 24, generates the site from the Markdown originals, checks it, and deploys the validated artifact to GitHub Pages. Pull requests run the build and checks without publishing.

**One-time activation:** in **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. This setting requires repository administration access. Then open [the publishing workflow](https://github.com/Zhuogang/weekly_ai_news/actions/workflows/pages.yml) and choose **Run workflow** on `main`, or rerun the latest failed deployment. Future report commits publish automatically. No personal access token or extra repository secret is required by the workflow.

For each new digest, commit only its complete Markdown report and the README index. The scheduled digest task does the research and archive write; GitHub Actions handles website generation and publishing. Generated HTML is an artifact, not tracked source. The workflow also supports manual runs from the Actions tab.

To check presentation or generation changes locally:

```sh
npm ci --ignore-scripts
npm run build
npm run check
```

The generated website is written to ignored `dist/`. The builder discovers dated Markdown reports automatically; no manual website index is needed. It preserves the source files, renders equations as native MathML, and keeps partial archives distinct from complete issues. Search covers dates, section headings, and opening highlights. The site uses no analytics, remote fonts, or runtime CDN dependencies.

Edit presentation in `site/assets/` and generation logic in `scripts/build-site.mjs`. Do not hand-edit or commit generated output. A local preview can be served with `python -m http.server 8000 --directory dist`.

Check [workflow runs](https://github.com/Zhuogang/weekly_ai_news/actions/workflows/pages.yml) for build and deployment logs. A failed build or validation check prevents deployment. If the initial deployment fails because Pages is not configured, activate it as above and rerun the failed deployment; the archive commit remains valid.
