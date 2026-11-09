# Digest archive instructions

- Save one complete Markdown file per original AI Research & Engineering Digest in `reports/YYYY/YYYY-MM-DD.md`.
- Use the original report date. Preserve the complete report, including its explicit source URLs, technical details, limitations, deeper reads, and experiment.
- Do not replace an original report with a summary or invent missing historical text from memory.
- If only an original excerpt is accessible, use a `.partial.md` suffix and state exactly what is missing. When the original becomes available, replace the partial file with the complete dated file and update the index.
- Omit ChatGPT-only citation widgets that cannot resolve outside the chat, retain explicit Markdown source links, and use GitHub-compatible math delimiters.
- Keep `README.md` current with a chronological report index and accurate backfill status. Never claim a complete backfill while reports remain missing.
- Read the current branch head before writing; preserve existing files and use a normal fast-forward commit on `main`. Never force-push.
- Verify that the remote commit contains the files before reporting a successful archive.

## GitHub Pages reading site

- The public reading site is `https://zhuogang.github.io/weekly_ai_news/`, published from `main:/docs` through GitHub Pages.
- Markdown reports remain canonical. Never edit report prose merely to change website layout.
- After adding or changing a report, run `npm ci --ignore-scripts`, `npm run build`, and `npm run check`. Commit the generated `docs/` alongside the report and README index. The builder automatically updates the homepage, archive, report pages, and navigation.
- Change design in `site/assets/` and generation in `scripts/build-site.mjs`; do not hand-edit `docs/`.
- Preserve complete versus partial labels and accurate historical-backfill status on the website.
- Verify the remote commit includes the generated site. Check the live dated report when possible; report publishing failures honestly without withholding the chat digest.
