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

- The reading site is `https://zhuogang.github.io/weekly_ai_news/`. GitHub Actions builds and deploys it through `.github/workflows/pages.yml` on pushes to `main`. The owner activates it by selecting **GitHub Actions** as the Pages source.
- Markdown reports remain canonical. Never edit report prose merely to change website layout.
- For routine digest delivery, commit the complete report and README index. The scheduled task does not need Node.js or a local website build. Never commit generated HTML; the workflow builds ignored `dist/`, validates it, and uploads it as a Pages artifact. Pull requests validate without deploying.
- Change design in `site/assets/` and generation in `scripts/build-site.mjs`. For code changes, run `npm ci --ignore-scripts`, `npm run build`, and `npm run check` locally when available. The builder automatically updates the homepage, archive, report pages, and navigation.
- Preserve complete versus partial labels and accurate historical-backfill status on the website.
- Verify the remote commit contains the report. Inspect the publishing workflow run for that exact commit when available, and check the live dated report after a successful deployment. Distinguish archive success, pending deployment, and publishing failure; never claim the website was updated without evidence. Deliver the full chat digest even when deployment is unavailable.
